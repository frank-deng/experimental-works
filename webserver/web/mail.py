import asyncio
import logging
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template
from aiohttp.web import HTTPFound
from urllib.parse import parse_qs
from . import WebServer
from .mailcenter import MailCenter


@WebServer.get('/mail.asp')
@WebServer.login_required(redirect=True)
@template('mail_frame.html')
async def mail_index(req:Request):
    return {}


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


@WebServer.get('/mail_editor.asp')
@WebServer.login_required()
@template('mail_editor.html')
async def mail_editor(req:Request):
    email_id=None
    if 'email_id' in req.url.query:
        try:
            email_id=int(req.url.query.get('email_id'))
        except TypeError:
            email_id=None
        except ValueError:
            email_id=None
    return {
        'email_id':email_id
    }


@WebServer.post('/mail_send.asp')
@WebServer.login_required()
@template('mail_send.html')
async def mail_send(req:Request):
    logger=logging.getLogger(__name__)
    config=req.app['config']
    encoding=config['web'].get('encoding')
    form_data_raw=parse_qs(await req.read())
    form_data={}
    for key_raw in form_data_raw:
        key=key_raw.decode('iso8859-1')
        form_data[key]=form_data_raw[key_raw][0].decode(encoding,errors='replace')
    if 'email_id' in form_data:
        try:
            form_data['email_id']=int(form_data['email_id'])
        except TypeError:
            form_data['email_id']=None
        except ValueError:
            form_data['email_id']=None
    logger.debug(form_data)
    if 'save_draft' in form_data:
        email_id=await MailCenter(req.app).save_draft(req.uid,form_data,form_data.get('email_id'))
        return Response(headers={'Location':f'/mail_editor.asp?email_id={email_id}'},status=303)
    return {}

