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


def __get_recp_list(recp:str):
    recp_list=[s.strip() for s in recp.split(';')]
    return [s for s in list(dict.fromkeys(recp_list)) if s]


async def __check_email(MailCenter,to,cc,subject,body):
    issues=[]
    if not subject:
        issues.append('标题不能为空')
    to_list=__get_recp_list(to)
    cc_list=__get_recp_list(cc)
    if (len(to_list)+len(cc_list))==0:
        issues.append('收件人或抄送人必须存在')
    else:
        to_dict=dict.fromkeys(to_list)
        for addr in to_list:
            if (await MailCenter.get_uid_from_addr(addr)) is None:
                issues.append(f'收件人{addr}无效')
        for addr in cc_list:
            if (await MailCenter.get_uid_from_addr(addr)) is None:
                issues.append(f'抄送人{addr}无效')
            elif addr in to_dict:
                issues.append(f'{addr}不能同时出现在收件人和抄送人中')
    return issues


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
    form_data['subject']=form_data.get('subject','').strip()
    issues=await __check_email(MailCenter(req.app),form_data.get('to',''),
        form_data.get('cc',''),form_data.get('subject',''),
        form_data.get('body',''))
    if len(issues):
        return{
            'email_id':form_data.get('email_id',None),
            'to':form_data.get('to',''),
            'cc':form_data.get('cc',''),
            'subject':form_data.get('subject',''),
            'body':form_data.get('body',''),
            'issues':issues,
        }
    return Response(headers={'Location':'/mail_list.asp?folder=sent'},
                    status=303)

