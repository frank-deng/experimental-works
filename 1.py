import asyncio
import aiohttp
from lxml import html
from lxml.etree import tostring
from urllib.parse import urlparse
import re

async def load_site(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    print('-'*50)
    resp=await load_site('https://news.china.com')
    tree = html.fromstring(resp)
    for item in tree.xpath('//a'):
        href=item.get('href').strip()
        text=item.text_content().strip()
        if not href or not text or href=='#':
            continue
        linkinfo=urlparse(href)
        if not re.search(r'\d{6,}\.html$',linkinfo.path):
            continue
        print(href)
        print(text)

asyncio.run(main())
