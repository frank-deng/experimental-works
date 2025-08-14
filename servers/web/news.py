import asyncio
import aiohttp
import logging
import hashlib
import base64
from lxml import html
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import render_string
from util import Logger
from pprint import pformat

class NewsManager(Logger):
    __host='https://apis.tianapi.com'
    def __init__(self,key):
        self.__key=key
        self.__newsLinks={}
        self.__newsLinksLock=asyncio.Lock()

    async def __fetch(self,path,params_in=None):
        params={'key':self.__key}
        if params_in is not None:
            params.update(params_in)
        async with aiohttp.ClientSession() as session:
            async with session.post(f'{self.__host}/{path}',data=params) as response:
                return await response.json()

    async def newsList(self):
        res=await self.__fetch('guonei/index',{'num':50})
        res=res['result']['newslist']
        async with self.__newsLinksLock:
            for item in res:
                item['id']=item['id'][:12]
                self.__newsLinks[item['id']]=item['url']
        return res

    async def newsDetail(self,newsid):
        newsLink=None
        async with self.__newsLinksLock:
            newsLink=self.__newsLinks.get(newsid,None)
        if newsLink is None:
            return None
        data=await self.__fetch('htmltext/index',{'url':newsLink})
        tree=html.fromstring(data['result']['content'])
        content=[]
        for item in tree.xpath('//p'):
            imgs=item.xpath('./img')
            for img in imgs:
                src=img.get('src')
                if src:
                    content.append({'type':'image','src':src})
            text=item.text_content().strip()
            if text:
                content.append({'type':'text','content':item.text_content()})
        return {
            'title':data['result']['title'],
            'content':content
        }

async def news_detail(req:Request):
    config=req.app['config']
    news=await req.app['newsManager'].newsDetail(req.url.query['id'])
    if news is None:
        return Response(text='404 Not Found')
    context={
        'header':'今日热点',
        'title':'今日热点',
        'news_title':news['title'],
        'news_content':news['content'],
    }
    encoding=config['web']['encoding']
    return Response(
        body=render_string("news.html",req,context).encode(encoding,errors='replace'),
        headers={
            'content-type':f"text/html; charset={encoding}"
        }
    )

async def news_handler(req:Request):
    if 'id' in req.url.query:
        return await news_detail(req)
    config=req.app['config']
    context={
        'header':'今日热点',
        'title':'今日热点',
        'news':await req.app['newsManager'].newsList()
    }
    encoding=config['web']['encoding']
    return Response(
        body=render_string("newslist.html",req,context).encode(encoding,errors='replace'),
        headers={
            'content-type':f"text/html; charset={encoding}"
        }
    )

