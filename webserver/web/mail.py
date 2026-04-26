import asyncio
import logging
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template
from datetime import datetime
from util.fonttool import FontProcessor
from mailcenter import MailCenter
from . import WebServer


@WebServer.get('/mail/login.asp')
@WebServer.post('/mail/login.asp')
@template('login.html')
async def login(req:Request):
    logger=logging.getLogger(__name__)
    config=req.app['config']
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
            fail_info='成功'
    return {
        'title':'登录',
        'header':'邮件中心',
        'username':username,
        'fail':fail_info,
    }

