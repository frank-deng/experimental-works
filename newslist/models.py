import json, urllib, httplib2, hashlib, threading, html, re;
from util import fetchJSON;
import config;
from collections import OrderedDict;

def showAPIFetchJSON(url, params = None):
    if None == params:
        params = {};
    params['showapi_appid'] = config.SHOWAPI_APPID;
    sign = '';
    for key in OrderedDict(sorted(params.items(), key=lambda x: x[0])):
        sign += key+str(params[key]);
    sign += config.SHOWAPI_SECRET;
    params['showapi_sign'] = hashlib.md5(sign.encode('UTF-8')).hexdigest();
    try:
        data = fetchJSON(url, body=params);
    except Exception as e:
        print(e);
        return None;
    keys = list(params.keys());
    for key in keys:
        del params[key];
    params = None;
    try:
        if (data and data['showapi_res_code'] == 0):
            return data['showapi_res_body'];
        else:
            return None;
    except KeyError:
        return None;

def fetchJokes(page = 1, pageSize = 50):
    return showAPIFetchJSON('http://route.showapi.com/341-1', {
        'page': int(page),
        'maxResult': pageSize,
    });

def fetchNews(page = 1, pageSize = 100):
    origData = showAPIFetchJSON('http://route.showapi.com/109-35', {
        'page': int(page),
        'maxResult': pageSize,
        'needAllList': 1,
    });
    result = [];
    if (None == origData):
        return None;
    for news in origData['pagebean']['contentlist']:
        # Filter news with no text content
        contentList = [];
        for content in news['allList']:
            if (isinstance(content, str)):
                contentList.append(content.strip());
        if (len(contentList) < 4):
            continue;
        result.append({
            'id': news['id'],
            'title': news['title'].strip(),
            'date': news['pubDate'],
            'content': contentList,
        });
    return result;

