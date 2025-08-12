import asyncio
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template

class Weather(Logger):
    def __init__(self,key):
        self.__key=key
