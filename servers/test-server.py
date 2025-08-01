#!/usr/bin/env python3

import asyncio
import logging
import signal
from util import Logger
from util import TCPServer
from util import ProcessHandler
import time

class ShellApp(ProcessHandler):
    async def create_subprocess_exec(self,slave_fd):
        while True:
            time.sleep(1)
        return await asyncio.create_subprocess_exec(
            *['/bin/bash','-i'],
            bufsize=0,
            start_new_session=True,
            stdin=slave_fd,
            stdout=slave_fd,
            stderr=slave_fd)

class TestServer(TCPServer):
    def __init__(self,config):
        super().__init__(config['port'])

    async def handler(self,reader,writer):
        try:
            async with ShellApp(reader,writer):
                pass
        except asyncio.TimeoutError:
            pass

