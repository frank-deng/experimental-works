import asyncio
import logging
import os
import json
from aiohttp.web import Request
from aiohttp.web import Response
from aiohttp_jinja2 import render_template
from datetime import datetime
from util.fonttool import FontProcessor


async def login(req:Request):
    config=req.app['config']

