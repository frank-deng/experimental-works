#!/usr/bin/env python3

import asyncio
import signal
import hashlib,subprocess,pty,fcntl,os,time
import configparser
import logger

pppdExec='/usr/sbin/pppd'
login_timeout=120
loginInfo={}
session_info={}

class Logger:
    _logger = None

    @property
    def logger(self):
        if self._logger is None:
            self._logger = logging.getLogger(self.__class__.__name__)
        return self._logger


async def service_main(reader,writer):
    global loginInfo
    writer.write(b'\r\nLogin:')
    await writer.drain()
    username=await read_line(reader,writer,echo=True,max_len=80)
    if not username:
        return True
    writer.write(b'Password:')
    await writer.drain()
    password=await read_line(reader,writer,echo=False,max_len=80)
    username=username.decode('UTF-8')
    password=hashlib.sha256(password).hexdigest();
    __loginInfo=loginInfo.get(username)
    if __loginInfo is None or password != __loginInfo['password']:
        writer.write(b'Login Failed.\r\n')
        await writer.drain()
        return True
    elif username in session_info:
        writer_orig=session_info[username]
        session_info[username]=writer
        writer_orig.close()
        await writer_orig.wait_closed()
    else:
        session_info[username]=writer
    __master, __slave = pty.openpty()
    fcntl.fcntl(__master, fcntl.F_SETFL, fcntl.fcntl(__master, fcntl.F_GETFL) | os.O_NONBLOCK)
    fcntl.fcntl(__slave, fcntl.F_SETFL, fcntl.fcntl(__slave, fcntl.F_GETFL) | os.O_NONBLOCK)
    ptyPath="/proc/%d/fd/%d"%(os.getpid(),__slave)
    subprocess.Popen([pppdExec,ptyPath,] + __loginInfo['options'], bufsize=0, start_new_session=True,
        stdin=__slave, stdout=__slave, stderr=__slave)
    try:
        while not writer.is_closing():
            try:
                writer.write(os.read(__master, 1024))
            except BlockingIOError:
                pass
            try:
                content=await asyncio.wait_for(reader.read(1024), timeout=0.01)
                if not content:
                    raise BrokenPipeError
                os.write(__master, content)
            except asyncio.TimeoutError:
                pass
            except BlockingIOError:
                pass
    finally:
        os.close(__slave)
        os.close(__master)
        if username in session_info and session_info[username]==writer:
            del session_info[username]
    return False

async def service_handler(reader,writer):
    try:
        running=True
        while running:
            running=await service_main(reader,writer)
    except asyncio.TimeoutError:
        writer.write(b'\r\n\r\nTimeout!!\r\n')
    except ConnectionResetError:
        pass
    except BrokenPipeError:
        pass
    except Exception as e:
        print_exc()
    finally:
        if not writer.is_closing():
            writer.close()
            await writer.wait_closed()

clas PPPConnection(Logger):
    __username=None
    def __init__(self,user_manager,reader,writer,*,login_timeout=120):
        self.__reader,self.__writer=reader,writer
        self.__login_timeout=login_timeout
        self.__user_manager=user_manager

    def close(self):
        if not self.__writer.is_closing():
            self.__writer.close()

    def wait_closed(self):
        await self.__writer.wait_closed()

    async def __readline(self,echo=True,max_len=1024):
        reader,writer=self.__reader,self.__writer
        res=b''
        running=True
        while running:
            char=await asyncio.wait_for(reader.read(1),
                                        timeout=self.__login_timeout)
            val=int.from_bytes(char,'little')
            if 0==val: #Connection closed
                raise BrokenPipeError
            elif 0x08==val and len(res)>0: #Backspace
                res=res[:-1]
                if(echo):
                    writer.write(b'\x08 \x08')
                    await writer.drain()
            elif 0x0d==val or 0x0a==val or 0==val: #Finished
                running=False
                writer.write(b'\r\n')
                await writer.drain()
            elif val>=0x20 and val<=0x7e and len(res)<max_len:
                res+=val.to_bytes(1,'little')
                if(echo):
                    writer.write(val.to_bytes(1,'little'))
                    await writer.drain()
        # Ignore input after Enter as much as possible
        try:
            await asyncio.wait_for(reader.read(max_len), timeout=0.01)
        except asyncio.TimeoutError:
            pass
        return res

    async def __login(self):
        self.__username=None
        writer.write(b'\r\nLogin:')
        await writer.drain()
        username=await self.__read_line(reader,writer,echo=True,max_len=80)
        if not username:
            return False
        writer.write(b'Password:')
        await writer.drain()
        password=await read_line(reader,writer,echo=False,max_len=80)
        username=username.decode('UTF-8')
        password=hashlib.sha256(password).hexdigest();
        __loginInfo=loginInfo.get(username)
        if __loginInfo is None or password != __loginInfo['password']:
            writer.write(b'Login Failed.\r\n')
            await writer.drain()
            return False
        self.__username=username
        return True

    async def __start_pppd(self):
        writer.write(b'Success\r\n')
        await writer.drain()
        await asyncio.sleep(30)
    
    async def run(self):
        try:
            while not await self.__login():
                pass
            await self.__start_pppd()
        except asyncio.TimeoutError:
            pass

    @property
    def username(self):
        return self.__username

class PPPUserManager(Logger):

class PPPServer(Logger):
    __reader=None
    __writer=None
    def __init__(self,config):
        self.__host=config.get('server','host',fallback='0.0.0.0')
        self.__port=config.getint('server','port',fallback=2345)
        self.__timeout=config.getint('server','login_timeout',fallback=120)
        self.__max_retry=config.getint('server','max_retry',fallback=3)

    def close(self):
        self.__server.close()

    async def run(self):
        self.__server=await asyncio.start_server(self.__handler,
            host=host,port=port,reuse_address=True,reuse_port=True)
        try:
            async with self.__server:
                await server.serve_forever()
        except asyncio.exceptions.CancelledError:
            pass
        except Exception as e:
            self.logger.critical(e,exc_info=True)
        finally:
            await self.__server.wait_closed()

    async def __handler(self,reader,writer):
        try:
            conn=PPPConnection(None,reader,writer,login_timeout=self.__timeout,
                               max_retry=self.__max_retry)
            await conn.run()
            conn.close()
        except Exception as e:
            self.logger.error(e,exc_info=True)

		
async def main(config):
    try:
        server = PPPServer(config)
        loop = asyncio.get_event_loop()
        for s in (signal.SIGINT, signal.SIGTERM, signal.SIGQUIT):
            loop.add_signal_handler(s, lambda: server.close())
        await server.run()
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)

if '__main__'==__name__:
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument(
        '--config',
        '-c',
        help='Specify config file for the PPP server.',
        default='./ppp-manager.ini'
    )
    args=parser.parse_args();
    config=configparser.ConfigParser()
    config.read(args.config)
    log_level=config.get('server','log_level',fallback='INFO')
    logging.basicConfig(
        filename=config.get('server','log_file',fallback='ppp-manager.log'),
        level=getattr(logging,log_level,logging.INFO)
    )
    asyncio.run(main(config))
