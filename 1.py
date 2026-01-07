import asyncio
import aiohttp
from lxml import html
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser
import re
from functools import cmp_to_key
from datetime import datetime, timedelta

class NewsManager:
    __host='https://news.china.com'
    @staticmethod
    def __newsListSort(a,b):
        keyA,keyB=a['key'],b['key']
        dateA,dateB=a['date'],b['date']
        if dateA<dateB or keyA<keyB:
            return 1
        else:
            return -1

    def __init__(self):
        self.__rp=RobotFileParser()

    async def __fetch(self,url):
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                return await response.text()

    async def newsList(self):
        res=[]
        resp,robots=await asyncio.gather(self.__fetch(self.__host),
            self.__fetch(self.__host+'/robots.txt'))
        self.__rp.parse(robots)
        href_set=set()
        tree = html.fromstring(resp)
        for item in tree.xpath('//a'):
            href=item.get('href').strip()
            if href in href_set:
                continue
            title=item.text_content().strip()
            if not href or not title or href=='#' or href in href_set:
                continue
            href_set.add(href)
            if not self.__rp.can_fetch('',href):
                continue
            linkinfo=urlparse(href)
            match=re.search(r'(20(\d{2}[01]\d[0-3]\d))/(\d+)\.html$',linkinfo.path)
            if not match:
                continue
            date_str,key=match[1],match[3]
            date_news=datetime.strptime(date_str,"%Y%m%d").date()
            date_limit=datetime.now().date()-timedelta(days=30)
            if date_news<date_limit:
                continue
            res.append({
                'key':int(key),
                'href':href,
                'date':date_news,
                'title':title
            })

        return sorted(res,key=cmp_to_key(self.__class__.__newsListSort))

async def main():
    print('-'*50)
    newsManager=NewsManager()
    newsList=await newsManager.newsList()
    for item in newsList:
        print(item)
    print('Count',len(newsList))

asyncio.run(main())
