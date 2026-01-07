import asyncio
import aiohttp
from lxml import html
from lxml import etree
from lxml.etree import tostring
import re
import sys

async def load_site(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    resp=await load_site(sys.argv[1])
    tree = html.fromstring(resp)
    for item in tree.xpath('//div[@id="js_article_content" or @id="chan_newsDetail"]'):
        print('-'*50)
        print(tostring(item,encoding='unicode'))

asyncio.run(main())

