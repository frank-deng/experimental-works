import asyncio
import logging
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template
from aiohttp.web import HTTPFound
from . import WebServer


@WebServer.get('/mail.asp')
@WebServer.login_required(redirect=True)
@template('mail_index.html')
async def mail_index(req:Request):
    return {}

