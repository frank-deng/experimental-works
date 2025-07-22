#!/usr/bin/env python3

import asyncio
import logging
import signal
from util import Logger
from util import TCPServer
from util import ConnectionHandler
from util import ReadLine
from util import LoginHandler


class TestConn(ConnectionHandler):
    def __init__(self,reader,writer):
        super().__init__(reader,writer)
        self.__reader,self.__writer=reader,writer
        self.set_timeout(20)
        self.__readline=ReadLine(self,70)

    async def __run_counter(self):
        counter=0
        while True:
            await self.write(f'{counter} '.encode())
            await asyncio.sleep(1)
            counter+=1

    async def run(self):
        while True:
            await self.write(b'>')
            cmd=await self.__readline.readline()
            if cmd is None:
                self.logger.debug('Conn closed during input')
            if cmd is None or cmd==b'quit':
                break
            if cmd==b'run':
                await self.__run_counter()
            await self.write(b'$')
            await self.write(cmd)
            await self.write(b'\r\n\r\n')


class TestServer(TCPServer):
    def __init__(self,port,*,host='0.0.0.0',max_conn=None):
        super().__init__(port,host=host,max_conn=max_conn)

    async def handler(self,reader,writer):
        try:
            login_handler=LoginHandler(reader,writer,retry=3,timeout=30)
            userinfo=None
            while True:
                userinfo=await login_handler.login()
                self.logger.debug(userinfo)
                if userinfo is None:
                    break
                elif userinfo[0]=='test':
                    break
            if userinfo is None:
                return
            self.logger.debug(userinfo)
            conn=TestConn(reader,writer)
            await conn.write(b'Login success')
            await conn.run()
        except asyncio.TimeoutError:
            pass

async def main():
    async with TestServer(6666,max_conn=1) as server:
        loop = asyncio.get_event_loop()
        for s in (signal.SIGINT,signal.SIGTERM,signal.SIGQUIT):
            loop.add_signal_handler(s,server.close)

if '__main__'==__name__:
    logging.basicConfig(
        level=logging.DEBUG
    )

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)
