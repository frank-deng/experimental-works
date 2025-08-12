from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import template

@template('index.html')
async def index(req:Request):
    config=req.app['config']
    links=config['web']['links']
    warningColorTable={
        '蓝色':'#0000ff',
        '黄色':'#a0a000',
        '橙色':'#ff8000',
        '红色':'#ff0000',
    }
    return {
        'dateStr':'hahaha',
        'weather':None,
        'weatherStr':'没有天气信息',
        'links':links
    }

