import asyncio
import logging
import os
import json
import hashlib
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template
from datetime import datetime
from util.fonttool import FontProcessor
from . import WebServer


def do_login(userdata_all,username,password):
    if not username or not password:
        return 1
    if username not in userdata_all:
        return 2
    userdata=userdata_all[username]
    if 'password' not in userdata:
        return 2
    password_hash=hashlib.sha256(password.encode('iso8859-1',errors='ignore')).hexdigest()
    if userdata['password']!=password_hash:
        return 2
    return 0


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
        res=do_login(config['mail']['user'],username,password)
        if res==1:
            fail_info='用户名和密码不能为空'
        elif res==2:
            fail_info='登录失败'
        else:
            fail_info='成功'
    return {
        'title':'登录',
        'header':'邮件中心',
        'username':username,
        'fail':fail_info,
    }

