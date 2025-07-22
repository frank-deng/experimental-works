#!/usr/bin/env python3

import asyncio
import logging
import signal
from util import Logger
from util import TCPServer

class TCPConnection(Logger):
    TASK_CANCEL_TIMEOUT=10
    __task=None
    __timeout=None
    __timestamp=None
    def __init__(self,reader,writer,**params):
        self.__reader,self.__writer=reader,writer
        self.__id=uuid.uuid4()

    async def __aenter__(self):
        try:
            self.__task=asyncio.create_task(self.__run_task())
        except Exception as e:
            self.logger.error(e,exc_info=True)

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        try:
            await self.__task
        except asyncio.CancelledError:
            pass

    async def __run_task(self):
        try:
            self.run()
        except (ConnectionResetError,BrokenPipeError) as e:
            self.logger.debug(f'Connection closed {e}')
        except Exception as e:
            self.logger.error(e,exc_info=True)
        finally:
            self.__writer.close()

    def __check_timeout(self):
        if self.__timeout is None or self.__timestamp is None:
            return
        elif time.time() - self.__timestamp > self.__timeout:
            raise asyncio.TimeoutError

    async def _run(self):
        pass

    def _set_timeout(self,timeout):
        self.__timeout=timeout
        if timeout is None:
            self.__timestamp
        else:
            self.__timestamp=time.time()

    async def _read(self,size,timeout=None):
        data=None
        if timeout is not None:
            try:
                data=await asyncio.wait_for(self.__reader.read(size),
                                            timeout=timeout)
            except asyncio.TimeoutError:
                pass
        else:
            data=await self.__reader.read(size)
        if data==b'':
            raise ConnectionResetError('Connection closed')
        self.__check_timeout()
        return data 

    async def _write(self,data):
        self.__writer.write(data)
        await self.__writer.drain()
        self.__check_timeout()

    async def close(self):
        self.__writer.close()
        try:
            await asyncio.wait_for(self.__task,
                                   timeout=TCPConnection.TASK_CANCEL_TIMEOUT)
        except asyncio.CancelledError:
            pass
        except asyncio.TimeoutError:
            self.__task.cancel()
            self.logger.debug('Connection task cancelled by force.')

    @property
    def conn_id(self):
        return self.__id

class TestServer(TCPServer):
    def __init__(self,port,*,host='0.0.0.0',max_conn=None):
        super().__init__(port,host=host,max_conn=max_conn)

    async def handler(self,reader,writer):
        counter=None
        while True:
            data=await reader.read(1)
            if data==b'':
                return
            self.logger.debug(data)
            writer.write(data)
            await writer.drain()
            if data==b'q':
                break
            elif data==b'n':
                counter=0
                break
        if counter is None:
            return
        while True:
            writer.write(f'{counter} '.encode())
            await writer.drain()
            await asyncio.sleep(1)

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
