import asyncio
import logging
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template
from aiohttp.web import HTTPFound
from . import WebServer


@WebServer.get('/mail.asp')
@WebServer.login_required(redirect=True)
@template('mail_frame.html')
async def mail_index(req:Request):
    return {
        'title':'邮件中心'
    }


@WebServer.get('/mail_left.asp')
@WebServer.login_required()
@template('mail_left.html')
async def mail_left(req:Request):
    return {}


@WebServer.get('/mail_list.asp')
@WebServer.login_required()
@template('mail_list.html')
async def mail_main(req:Request):
    return {}

