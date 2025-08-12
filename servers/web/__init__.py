import asyncio
import aiohttp
import aiohttp_jinja2
from jinja2 import FileSystemLoader
from aiohttp import web
from util import Logger

from web.index import index

class WebServer(Logger):
    __runner=None
    __site=None
    def __init__(self,config):
        self.__host=config['web']['host']
        self.__port=config['web']['port']
        self.__app=web.Application()
        self.__app['config']=config
        self.__app.router.add_get("/",index)
        self.__app.router.add_get("/index.asp",index)
        aiohttp_jinja2.setup(self.__app,
            loader=FileSystemLoader(config['web']['template_dir']),
            autoescape=True)

    async def __aenter__(self):
        self.__runner=web.AppRunner(self.__app)
        await self.__runner.setup()
        self.__site=web.TCPSite(self.__runner,self.__host,self.__port)
        await self.__site.start()

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        if self.__site is not None:
            await self.__site.stop()
        if self.__runner is not None:
            await self.__runner.cleanup()

