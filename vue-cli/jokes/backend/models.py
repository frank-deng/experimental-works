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
