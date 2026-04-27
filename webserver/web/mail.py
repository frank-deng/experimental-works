import asyncio
import logging
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp.web import HTTPFound
from aiohttp_jinja2 import template
from datetime import datetime

from aiohttp_session import get_session, new_session

from util.fonttool import FontProcessor
from mailcenter import MailCenter
from . import WebServer
from . import OldBrowserCookieStorage

@WebServer.get('/mail')
@WebServer.get('/mail/')
async def mail_index_redirect(req:Request):
    return HTTPFound('/mail/index.asp')

@WebServer.get('/mail/index.asp')
@template('mail_index.html')
async def mail_index(req:Request):
    logger=logging.getLogger(__name__)
    session=await get_session(req)
    if session.get('user') is None:
        session.invalidate()
        return HTTPFound('/mail/login.asp')
    return {}


@WebServer.get('/mail/login.asp')
@WebServer.post('/mail/login.asp')
@template('login.html')
async def login(req:Request):
    username=''
    fail_info=None
    if req.method=='POST':
        form_data=await req.post()
        username=form_data.get('username','')
        password=form_data.get('password')
        if not username or not password:
            fail_info='用户名和密码不能为空'
        elif not MailCenter(req.app).auth(username,password):
            fail_info='登录失败'
        else:
            session=await new_session(req)
            session["user"]=username
            return HTTPFound('/mail/index.asp')
    return {
        'title':'登录',
        'header':'邮件中心',
        'username':username,
        'fail':fail_info,
    }


@WebServer.get('/mail/logout.asp')
async def logout(req:Request):
    logger=logging.getLogger(__name__)
    try:
        session = await get_session(req)
        session.invalidate()
        resp=HTTPFound('/mail/login.asp')
        return resp
    except Exception as e:
        logger.error(e,exc_info=True)

