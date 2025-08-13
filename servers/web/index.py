from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import render_string
from datetime import datetime
from web.weather import WeatherData

async def index(req:Request):
    config=req.app['config']
    links=config['web']['links']
    locid=req.cookies.get('location',None)
    warningColorTable={'蓝色':'#0000ff','黄色':'#a0a000',
                       '橙色':'#ff8000','红色':'#ff0000'}
    weather=None
    if locid:
        weatherData=WeatherData(config['web']['heweather_key'])
        weather=await weatherData.fetch_weather(locid)
        location=weather['location']
        location_str=location['adm2']
        if location['name']!=location['adm2']:
            location_str+='-'+location['name']
        weather['location_str']=location_str
        for item in weather['warning']:
            item['level_rgb']=warningColorTable.get(item['level'],'#000000')
    context={
        'dateStr':datetime.now().strftime('%Y年%-m月%-d日'),
        'weather':weather,
        'links':links
    }
    encoding=config['web']['encoding']
    return Response(
        body=render_string("index.html",req,context).encode(encoding,errors='replace'),
        headers={
            'content-type':f"text/html; charset={encoding}"
        }
    )

