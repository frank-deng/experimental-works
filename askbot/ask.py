#!/usr/bin/env python3
#-*- coding:utf-8-*

import asyncio,signal,json,hashlib,os,re,threading,importlib,platform
import aiohttp,asyncio,json,sys

async def getAccessToken(client_id,client_secret):
    url='https://aip.baidubce.com/oauth/2.0/token'
    data={
        'grant_type':'client_credentials',
        'client_id':client_id,
        'client_secret':client_secret
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url,data=data) as response:
            res=json.loads(await response.text())
            if res is not None and 'access_token' in res:
                return res['access_token']
    return None
    
async def askBot(access_token,question):
    url=f"https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token={access_token}"
    jsonData={
        'messages':[
            {
                'role':'user',
                'content':question
            }
        ]
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url,json=jsonData) as response:
            res=json.loads(await response.text())
            return res.get('result',None)
    return None

async def main(args,config):
    access_token=await getAccessToken(config['client_id'],config['client_secret'])
    content=''
    print('请输入您的问题：')
    for line in sys.stdin:
        line=line.rstrip()
        if '.' == line:
            break
        content+=line+'\n'
    sys.stdin.close()
    print('回答中……')
    print(await askBot(access_token,content))

if '__main__'==__name__:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--config',
        '-c',
        help='Specify config file.',
        default='./config.json'
    )
    args = parser.parse_args();
    config=None
    with open(args.config, 'r') as f:
        config=json.load(f)
    asyncio.run(main(args,config))
