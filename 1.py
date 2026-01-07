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
        hrefA,hrefB=a['href'],b['href']
        dateA,dateB=a['date'],b['date']
        matchA=re.search(r'(\d+).html$',hrefA)
        matchB=re.search(r'(\d+).html$',hrefB)
        valA,valB=matchA[1],matchB[1]
        if dateA<dateB or valA<valB:
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
            if not href or not title or href=='#':
                continue
            linkinfo=urlparse(href)
            if not re.search(r'\d{6,}\.html$',linkinfo.path):
                continue
            href_set.add(href)
            if not self.__rp.can_fetch('',href):
                continue
            datestr=linkinfo.path.split('/')[-2]
            date_news=datetime.strptime(datestr,"%Y%m%d").date()
            date_limit=datetime.now().date()-timedelta(days=30)
            if date_news<date_limit:
                continue
            res.append({
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
