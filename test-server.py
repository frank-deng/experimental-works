#!/usr/bin/env python3

import asyncio
import logging
import signal
from util import Logger
from util import TCPServer
from util import ConnectionHandler
from util import ReadLine
from util import LoginHandler
from util import SingleUserConnManager


class TestConn(ConnectionHandler):
    def __init__(self,reader,writer):
        super().__init__(reader,writer)
        self.__reader,self.__writer=reader,writer
        self.set_timeout(200)
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


class UserManager(SingleUserConnManager):
    def __init__(self):
        super().__init__()
        self.__passwd={
            'test':'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            'aaa':'9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee8f0',
        }

    async def login(self,username,password,writer):
        if username is None or password is None or self.__passwd.get(username,'')!=password:
            return None
        await super().login(username,writer)
        return True


class TestServer(TCPServer):
    def __init__(self,port,*,host='0.0.0.0',max_conn=None):
        super().__init__(port,host=host,max_conn=max_conn)
        self.__user_manager=UserManager()

    async def handler(self,reader,writer):
        username,userinfo=None,None
        try:
            login_handler=LoginHandler(reader,writer,retry=3,timeout=30)
            while True:
                username,password=await login_handler.login()
                if username is None:
                    return
                userinfo=await self.__user_manager.login(username,password,writer)
                if userinfo is not None:
                    break
            conn=TestConn(reader,writer)
            await conn.write(b'Login success')
            await conn.run()
        except asyncio.TimeoutError:
            pass
        finally:
            await self.__user_manager.logout(username,writer)

async def main():
    async with TestServer(6666,max_conn=10) as server:
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
