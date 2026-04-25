import asyncio
import logging
import os
import json
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import render_template
from datetime import datetime
from util.fonttool import FontProcessor
from . import WebServer


@WebServer.get('/basicauth.asp')
async def basicauth(req:Request):
    config=req.app['config']
    return Response(headers={
        'WWW-Authenticate':'Basic realm="Login Required"'
    },text='Authentication Required.',status=401)
    resp=render_template("index.html",req,{})
    return resp

