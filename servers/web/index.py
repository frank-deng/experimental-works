from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import render_string
from datetime import datetime

async def index(req:Request):
    config=req.app['config']
    links=config['web']['links']
    warningColorTable={
        '蓝色':'#0000ff',
        '黄色':'#a0a000',
        '橙色':'#ff8000',
        '红色':'#ff0000',
    }
    context={
        'dateStr':datetime.now().strftime('%Y年%-m月%-d日'),
        'weather':None,
        'links':links
    }
    utf8_content=render_string("index.html",req,context)
    output_encoding=config['web']['encoding']
    return Response(
        body=utf8_content.encode(output_encoding,errors='replace'),
        headers={
            'content-type':f"text/html; charset={output_encoding}"
        }
    )

