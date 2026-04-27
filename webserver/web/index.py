from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template
from aiohttp_session import get_session, new_session
from . import WebServer
from .mailcenter import MailCenter

@WebServer.get('/')
@WebServer.get('/index.asp')
@template('index.html')
async def index(req:Request):
    return{}


@WebServer.get('/login.asp')
@WebServer.post('/login.asp')
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
            return Response(headers={'Location':'/mail.asp'},status=303)
    return {
        'title':'登录',
        'header':'邮件中心',
        'username':username,
        'fail':fail_info,
        'post_url':'/login.asp'
    }


@WebServer.get('/logout.asp')
@WebServer.post('/logout.asp')
async def logout(req:Request):
    session = await get_session(req)
    session.invalidate()
    return Response(headers={'Location':'/'},status=303)

