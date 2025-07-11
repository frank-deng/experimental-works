#!/usr/bin/env python3

import asyncio
import signal
import hashlib
import subprocess
import pty
import fcntl
import os
import configparser
import logging


class Logger:
    _logger = None

    @property
    def logger(self):
        if self._logger is None:
            self._logger = logging.getLogger(self.__class__.__name__)
        return self._logger


class PPPConnection(Logger):
    __username=None
    __task=None
    def __init__(self,reader,writer,*,login_timeout=120,max_retry=3):
        self.__reader,self.__writer=reader,writer
        self.__login_timeout=login_timeout

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
        reader,writer=self.__reader,self.__writer
        self.__username=None
        writer.write(b'\r\nLogin:')
        await writer.drain()
        username=await self.__readline(reader,writer,echo=True,max_len=80)
        if not username:
            return False
        writer.write(b'Password:')
        await writer.drain()
        password=await self.__readline(reader,writer,echo=False,max_len=80)
        username=username.decode('UTF-8')
        password=hashlib.sha256(password).hexdigest();
        self.__username=username
        return True

    async def __start_pppd(self):
        reader,writer=self.__reader,self.__writer
        writer.write(b'Success\r\n')
        await writer.drain()
        for i in range(30):
            writer.write(f'{i}'.encode('iso8859-1')+b' ')
            await writer.drain()
            await asyncio.sleep(30)
    
    async def __run(self):
        try:
            while not await self.__login():
                pass
            await self.__start_pppd()
        except (asyncio.TimeoutError,asyncio.CancelledError,ConnectionResetError,BrokenPipeError) as e:
            self.logger.debug(f'Connection closed {e}')
        except Exception as e:
            self.logger.error(e,exc_info=True)
        finally:
            if not self.__writer.is_closing():
                self.__writer.close()
                await self.__writer.wait_closed()

    async def __aenter__(self):
        try:
            self.__task=asyncio.create_task(self.__run())
        except Exception as e:
            self.logger.error(e,exc_info=True)

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        if self.__task is not None:
            await self.__task

    async def close(self):
        if self.__task is not None:
            self.__task.cancel()
            await self.__task


class PPPUserManager(Logger):
    def __init__(self,config):
        self.__userlist_file=config.get('server','userlist')
        self.__passwd={}
        self.__conn={}

    async def __aenter__(self):
        with open(self.__userlist_file,'r',encoding='utf-8') as fp:
            for line in fp:
                username,password=line.strip().split('|')
                self.__passwd[username]=password

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        pass


class PPPServer(PPPUserManager):
    __server=None
    __conn=set()
    def __init__(self,config,*,signal_shutdown=(signal.SIGINT,signal.SIGTERM,signal.SIGQUIT)):
        super().__init__(config)
        self.__host=config.get('server','host',fallback='0.0.0.0')
        self.__port=config.getint('server','port',fallback=2345)
        self.__timeout=config.getint('server','login_timeout',fallback=120)
        self.__max_retry=config.getint('server','max_retry',fallback=3)
        if signal_shutdown is not None:
            loop = asyncio.get_event_loop()
            for s in signal_shutdown:
                loop.add_signal_handler(s,lambda:self.shutdown())

    async def __aenter__(self):
        await super().__aenter__()
        self.__server=await asyncio.start_server(self.__handler,
            host=self.__host,port=self.__port,
            reuse_address=True,reuse_port=True)
        return self

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        self.logger.debug('close server')
        if self.__server is not None:
            await self.__server.wait_closed()
            self.__server=None
        self.logger.debug('wait_closed ok')

        close_tasks=[]
        for conn in self.__conn:
            close_tasks.append(conn.close())
        await asyncio.gather(*close_tasks)
        self.logger.debug('close_connections ok')

        await super().__aexit__(exc_type,exc_val,exc_tb)
        self.logger.debug('close server finish')

    async def serve_forever(self):
        if self.__server is None:
            raise RuntimeError('Server not initialized')
        try:
            await self.__server.serve_forever()
        except asyncio.CancelledError:
            pass

    def shutdown(self):
        if self.__server is not None:
            self.logger.debug('Start close server')
            self.__server.close()

    async def __handler(self,reader,writer):
        conn=None
        try:
            conn=PPPConnection(reader,writer,login_timeout=self.__timeout,
                               max_retry=self.__max_retry)
            async with conn:
                self.__conn.add(conn)
        except Exception as e:
            self.logger.error(e,exc_info=True)
        finally:
            self.__conn.discard(conn)

		
async def main(config):
    try:
        async with PPPServer(config) as server:
            await server.serve_forever()
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)

if '__main__'==__name__:
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument(
        '--config',
        '-c',
        help='Specify config file for the PPP server.',
        default='ppp-manager.ini'
    )
    args=parser.parse_args();
    config=configparser.ConfigParser()
    config.read(args.config)
    log_level=config.get('server','log_level',fallback='INFO')
    logging.basicConfig(
        filename=config.get('server','log_file',fallback='ppp-manager.log'),
        level=getattr(logging,log_level,logging.INFO)
    )
    try:
        asyncio.run(main(config))
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)
