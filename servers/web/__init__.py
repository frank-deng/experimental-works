import asyncio
import aiohttp
from aiohttp import web
from util import Logger

class WebServer(Logger):
    def __init__(self,config):
        self.__conf=config
