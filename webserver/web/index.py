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


def login_ctx(username='',fail_info=None):
    return {
        'title':'登录',
        'header':'用户登录',
        'username':username,
        'fail':fail_info,
        'post_url':'/login.asp'
    }


@WebServer.get('/login.asp')
@WebServer.post('/login.asp')
@template('login.html')
async def login(req:Request):
    if req.method!='POST':
        return login_ctx('',None)
    form_data=await req.post()
    username=form_data.get('username','')
    password=form_data.get('password')
    if not username or not password:
        return login_ctx(username,'用户名和密码不能为空')
    uid=await MailCenter(req.app).auth(username,password)
    if uid is None:
        return login_ctx(username,'登录失败')
    session=await new_session(req)
    session["uid"]=uid
    return Response(headers={'Location':'/mail.asp'},status=303)


@WebServer.get('/logout.asp')
@WebServer.post('/logout.asp')
async def logout(req:Request):
    session = await get_session(req)
    session.invalidate()
    return Response(headers={'Location':'/'},status=303)

