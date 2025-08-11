from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template

@template('index.html')
async def index(req:Request):
    return None

