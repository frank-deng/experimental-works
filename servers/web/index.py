from aiohttp.web import Request
from aiohttp.web import Response

async def index(req:Request):
    return Response(text="Hahaha from aiohttp!")
