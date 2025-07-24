#!/usr/bin/env python3

import asyncio
import logging
import signal
from util import Logger
from util import TCPServer
from util import ProcessHandler
import os
import pty

class ShellApp(ProcessHandler):
    async def create_subprocess_exec(self,slave_fd):
        return await asyncio.create_subprocess_exec(
            *['/bin/bash','-i'],
            bufsize=0,
            start_new_session=True,
            stdin=slave_fd,
            stdout=slave_fd,
            stderr=slave_fd)

class TestServer(TCPServer):
    def __init__(self,port,*,host='0.0.0.0',max_conn=None):
        super().__init__(port,host=host,max_conn=max_conn)

    async def handler(self,reader,writer):
        try:
            async with ShellApp(reader,writer):
                pass
        except asyncio.TimeoutError:
            pass

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
