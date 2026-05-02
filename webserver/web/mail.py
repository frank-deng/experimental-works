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
    logger=logging.getLogger(__name__)
    folder=req.url.query.get('folder')
    page=req.url.query.get('page',0)
    email_list,total=[],0
    if folder=='draft':
        email_list,total=await MailCenter(req.app).get_email_list_draft(req.uid,page)
    return {
        'email_list':email_list,
        'folder':folder,
        'total':total,
        'page':page
    }


@WebServer.get('/mail_editor.asp')
@WebServer.login_required()
@template('mail_editor.html')
async def mail_editor(req:Request):
    logger=logging.getLogger(__name__)
    email=None
    email_id=req.url.query.get('email_id')
    if not email_id:
        return {}
    email=await MailCenter(req.app).get_email_draft(req.uid,email_id)
    return {
        'email_id':email['id'],
        'to':email['to_orig'],
        'cc':email['cc_orig'],
        'subject':email['subject'],
        'body':email['body'],
    }


async def process_mail(forn_data):
    if 'save_draft' in form_data or 'delete_draft' in form_data:
        return None
    to_list=[s.strip() for s in to.split(';')]
    cc_list=[s.strip() for s in cc.split(';')]


@WebServer.post('/mail_editor.asp')
@WebServer.login_required()
@template('mail_editor.html')
async def mail_editor_send(req:Request):
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
        return{
            'email_id':email_id,
            'to':form_data.get('to',''),
            'cc':form_data.get('cc',''),
            'subject':form_data.get('subject',''),
            'body':form_data.get('body',''),
        }
    elif 'delete_draft' in form_data:
        await MailCenter(req.app).delete_draft(req.uid,form_data.get('email_id'))
        return{}
    to_list,cc_list=process_mail(form_data['to'],form_data['cc'])
    return Response(headers={'Location':'/mail_list.asp?folder=sent'},status=303)

