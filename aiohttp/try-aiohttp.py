#!/usr/bin/env python3
MESSAGE={
        'message':'布団の中から出たくない'
};

import asyncio;
from aiohttp import web;

async def messageHandler(request):
    return web.json_response(MESSAGE);

async def init(loop_event):
    app=web.Application(loop=loop_event);
    app.router.add_get('/',messageHandler,name='get_message');
    server=await loop.create_server(app.make_handler(),'0.0.0.0',8090);
    print('Server started at http://0.0.0.0:8090');
    return app;

if '__main__'==__name__:
    loop=asyncio.get_event_loop();
    loop.run_until_complete(init(loop));
    loop.run_forever();

