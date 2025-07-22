import asyncio
import logging
import uuid
import time

class Logger:
    _logger = None

    @property
    def logger(self):
        if self._logger is None:
            self._logger = logging.getLogger(self.__class__.__name__)
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

    async def __add_conn(self,writer):
        async with self.__lock:
            if self.__max_conn is None or len(self.__conn)<self.__max_conn:
                self.__conn.add(writer)
                return True
        return False
    
    async def __handler(self,reader,writer):
        try:
            if await self.__add_conn(writer):
                await self.handler(reader,writer)
        except Exception as e:
            self.logger.error(e,exc_info=True)
        finally:
            writer.close()
            async with self.__lock:
                self.__conn.discard(writer)

    def close(self):
        self.__wait_close.set()

    async def handler(self,reader,writer):
        pass

