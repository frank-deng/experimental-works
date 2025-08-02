#!/usr/bin/env python3

import logging
import argparse
import asyncio
import signal
import os
import sys
import pam
import pamela
import pwd
import pty
import fcntl
import termios
import struct


async def readline(reader,writer,*,timeout=120,size=70,echo=True):
    inp,inp_len=bytearray(size),0

    async def read_char():
        char=None
        while char is None:
            char=await asyncio.wait_for(reader.read(1),timeout=timeout)
        return char

    async def handle_backspace():
        nonlocal inp_len
        if inp_len<=0:
            return
        inp_len-=1
        if echo:
            writer.write(b'\x08 \x08')
            await writer.drain()

    async def handle_char(char):
        nonlocal inp_len
        val=int.from_bytes(char,'little')
        if val>=0x20 and val<=0x7e and inp_len<size:
            inp[inp_len]=val
            inp_len+=1
            if echo:
                writer.write(char)
                await writer.drain()

    res=None
    while True:
        char=await read_char()
        if char==b'': #Disconnected
            inp_len=None
            break
        elif char in (b'\x0d',b'\x0a'): #Finished
            writer.write(b'\r\n')
            await writer.drain()
            break
        elif b'\x08'==char: #Backspace
            await handle_backspace()
        else:
            await handle_char(char)

    if inp_len is not None:
        res=bytes(inp[:inp_len])
        # Ignore input after Enter as much as possible
        try:
            await asyncio.wait_for(reader.read(1000),timeout=0.1)
        except asyncio.TimeoutError:
            pass
    return res


async def login(reader,writer):
    username=b''
    while username==b'':
        writer.write(b'\r\nLogin:')
        await writer.drain()
        username=await readline(reader,writer,echo=True)
    if username is None:
        return None,None
    writer.write(b'Password:')
    await writer.drain()
    password=await readline(reader,writer,echo=False)
    if password is None:
        return None,None
    return username.decode(),password.decode()


class Logger:
    _logger=None
    @property
    def logger(self):
        if self._logger is None:
            self._logger=logging.getLogger(self.__class__.__name__)
        return self._logger


class TCPServer(Logger):
    __server=None
    def __init__(self,port,*,host='0.0.0.0',max_conn=None):
        self.__port=port
        self.__host=host
        self.__max_conn=max_conn
        self.__conn=set()
        self.__lock=asyncio.Lock()
        self.__wait_close=asyncio.Event()

    async def __aenter__(self):
        self.__server=await asyncio.start_server(self.__handler,
            host=self.__host,port=self.__port,
            reuse_address=True,reuse_port=True)
        return self

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        await self.__wait_close.wait()
        self.__server.close()
        wait_tasks=[self.__server.wait_closed()]
        async with self.__lock:
            self.__max_conn=0
            for conn in self.__conn:
                conn.close()
                wait_tasks.append(conn.wait_closed())
        await asyncio.gather(*wait_tasks)

    async def __handler(self,reader,writer):
        try:
            async with self.__lock:
                if self.__max_conn is None or len(self.__conn)<self.__max_conn:
                    self.__conn.add(writer)
                else:
                    return
            await self.handler(reader,writer)
        except (ConnectionResetError,BrokenPipeError,asyncio.TimeoutError):
            pass
        except Exception as e:
            self.logger.error(e,exc_info=True)
        finally:
            async with self.__lock:
                self.__conn.discard(writer)
            writer.close()
            await writer.wait_closed()

    def close(self):
        self.__wait_close.set()

    async def handler(self,reader,writer):
        pass


class ProcessHandler(Logger):
    __buf_size=4096
    __proc=None
    __master_fd=None
    __slave_fd=None
    __pty_reader=None
    __tasks=None
    def __init__(self,reader,writer,*,buf_size=4096):
        self.__reader,self.__writer=reader,writer
        self.__buf_size=buf_size
        self.__loop=asyncio.get_running_loop()
        self.__queue=asyncio.Queue()

    async def __aenter__(self):
        try:
            self.__master_fd,self.__slave_fd=pty.openpty()
            await self.create_subprocess_exec(self.__master_fd,self.__slave_fd)
            os.close(self.__slave_fd)
            os.set_blocking(self.__master_fd,False)
            self.__tasks=(
                asyncio.create_task(self.__pty_to_tcp()),
                asyncio.create_task(self.__tcp_to_pty())
            )
        except Exception as e:
            await self.__cleanup()
            raise
        return self

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        if self.__tasks is not None:
            await asyncio.wait(self.__tasks,return_when=asyncio.FIRST_COMPLETED)
        await self.__cleanup()

    def __fd_ready(self):
        try:
            data=os.read(self.__master_fd,self.__buf_size)
            if not data:
                self.__loop.call_soon(self.__queue.put_nowait,b"")
                return
            self.__queue.put_nowait(data)
        except (OSError,asyncio.CancelledError):
            self.__queue.put_nowait(b"")

    async def __pty_to_tcp(self):
        self.__loop.add_reader(self.__master_fd,self.__fd_ready)
        try:
            while True:
                data=await self.__queue.get()
                if not data:
                    break
                self.__writer.write(data)
                await self.__writer.drain()
        except (ConnectionResetError,asyncio.CancelledError):
            pass
        except Exception as e:
            self.logger.error(e,exc_info=True)
        finally:
            self.__loop.remove_reader(self.__master_fd)

    async def __write_fd(self,data):
        n=None
        while data:
            try:
                n=os.write(self.__master_fd,data)
                data=data[n:]
            except BlockingIOError:
                self.logger.debug(f'Partial data written {n}/{len(data)}')
                await asyncio.sleep(0.01)

    async def __tcp_to_pty(self):
        try:
            while True:
                data=await self.__reader.read(self.__buf_size)
                if not data:
                    break
                await self.__write_fd(data)
        except (ConnectionResetError,OSError,asyncio.CancelledError):
            pass
        except Exception as e:
            self.logger.error(e,exc_info=True)

    async def __cleanup(self):
        try:
            if self.__tasks is not None:
                for task in self.__tasks:
                    if not task.done():
                        task.cancel()
                await asyncio.gather(*self.__tasks)
        except Exception as e:
            self.logger.error(e,exc_info=True)
        finally:
            self.__close_fd(self.__master_fd)
            self.__master_fd=None

    def __close_fd(self,fd):
        try:
            if fd is not None:
                os.close(fd)
        except Exception as e:
            self.logger.error(e,exc_info=True)

    async def create_subprocess_exec(self,slave_fd):
        pass


class UserShellHandler(ProcessHandler):
    def __init__(self,reader,writer,username,*,buf_size=4096):
        super().__init__(reader,writer,buf_size=buf_size)
        self.__username=username
        self.__userinfo=pwd.getpwnam(username)

    async def create_subprocess_exec(self,master_fd,slave_fd):
        env={
            'USER':self.__userinfo.pw_name,
            'HOME':self.__userinfo.pw_dir,
            'SHELL':self.__userinfo.pw_shell,
            'TERM':'ansi.sys',
            'PATH':'/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
        }
        fcntl.ioctl(slave_fd,termios.TIOCSWINSZ,struct.pack('HHHH',24,80,0,0))
        pid=os.fork()
        if pid==0:
            os.close(master_fd)
            os.setsid()
            os.close(os.open(os.ttyname(slave_fd),os.O_RDWR))
            os.dup2(slave_fd,0)
            os.dup2(slave_fd,1)
            os.dup2(slave_fd,2)
            os.close(slave_fd)
            pamela.open_session(self.__userinfo.pw_name)
            os.setgid(self.__userinfo.pw_gid)
            os.setuid(self.__userinfo.pw_uid)
            for key,value in env.items():
                os.environ[key]=value
            os.chdir(self.__userinfo.pw_dir)
            os.execl(self.__userinfo.pw_shell,self.__userinfo.pw_shell,'--login')
            os._exit(1)


class DialInServer(TCPServer):
    def __init__(self,port,*,host,max_conn):
        super().__init__(port,host=host,max_conn=max_conn)

    async def handler(self,reader,writer):
        login_failed_count=0
        while login_failed_count<3:
            username,password=await login(reader,writer)
            if username is None or password is None:
                break
            p=pam.pam()
            if not p.authenticate(username,password):
                login_failed_count+=1
                writer.write(b'Login Failed.\r\n')
                await asyncio.gather(writer.drain(),asyncio.sleep(1))
                continue
            login_failed_count=0
            async with UserShellHandler(reader,writer,username):
                pass


async def main(args):
    try:
        async with DialInServer(args.port,host=args.host,
                max_conn=args.max_connection) as server:
            loop = asyncio.get_event_loop()
            for s in (signal.SIGINT,signal.SIGTERM,signal.SIGQUIT):
                loop.add_signal_handler(s,server.close)
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)


if '__main__'==__name__:
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument(
        '--host',
        '-H',
        help='Server host',
        default='0.0.0.0'
    )
    parser.add_argument(
        '--max-connection',
        '-m',
        help='Max connection',
        default=None,
        type=int
    )
    parser.add_argument(
        'port',
        help='Port',
        type=int
    )
    args=parser.parse_args()
    logging.basicConfig(
        format='[%(asctime)s][%(levelname)s]%(message)s',
        filename='/var/log/dialin-server.log',
        level=logging.DEBUG
    )
    asyncio.run(main(args))

