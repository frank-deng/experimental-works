import asyncio
import aiohttp
import logging
import json
from urllib.parse import parse_qsl
from urllib.parse import urlencode
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import render_string
from util import Logger

class WeatherData(Logger):
    def __init__(self,key,*,encoding):
        self.__key=key
        self.__encoding=encoding

    async def search_city(self,keyword):
        url='https://geoapi.qweather.com/v2/city/lookup?'
        params={
            'key':self.__key,
            'range':'cn',
            'number':20,
            'location':keyword
        }
        res=None
        location_data=[]
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url,params=params) as response:
                    location_data=json.loads(await response.text())['location']
            res=[]
            for item in location_data:
                name=item['adm1']+'-'+item['adm2']
                if item['name']!=item['adm2']:
                    name+='-'+item['name']
                href_param={
                    'location':(item['id']+','+name).encode(self.__encoding)
                }
                res.append({
                    'id':item['id'],
                    'name':name,
                    'href':'weather.asp?'+urlencode(href_param)
                })
        except Exception as e:
            self.logger.error(f'Failed to search city: {e}',exc_info=True)
            res=None
        return res

async def select_city(req:Request):
    config=req.app['config']
    encoding=config['web']['encoding']
    city=''
    cityList=None
    for key,value in parse_qsl(req.url.raw_query_string,encoding=encoding):
        if key=='city':
            city=value
    if city:
        weatherData=WeatherData(config['web']['heweather_key'],encoding=encoding)
        cityList=await weatherData.search_city(city)

    context={
        'header':'天气预报',
        'title':'天气预报',
        'city':city,
        'cityList':cityList
    }
    utf8_content=render_string("select_city.html",req,context)
    return Response(
        body=utf8_content.encode(encoding,errors='replace'),
        headers={
            'content-type':f"text/html; charset={encoding}"
        }
    )


async def weather(req:Request):
    config=req.app['config']
    context={
        'header':'天气预报',
        'title':'天气预报 - 地名',
    }
    utf8_content=render_string("index.html",req,context)
    output_encoding=config['web']['encoding']
    return Response(
        body=utf8_content.encode(output_encoding,errors='replace'),
        headers={
            'content-type':f"text/html; charset={output_encoding}"
        }
    )

