import json, urllib, httplib2, hashlib, jieba;
from collections import OrderedDict;
import config;

def fetchJSON(url, headers = None, body = None):
    http = httplib2.Http(timeout = config.REQUEST_TIMEOUT);
    if (None != body):
        if isinstance(body, dict):
            if None == headers:
                headers = {'content-type': 'application/x-www-form-urlencoded'};
            else:
                headers['content-type'] = 'application/x-www-form-urlencoded';
            body = urllib.parse.urlencode(body);
        resp,content = http.request(url, 'POST', body, headers=headers);
    else:
        resp,content = http.request(url, 'GET', headers=headers);
    return json.loads(content.decode('UTF-8'));

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

def getJokes(page = 1, size = 10):
    global cache;
    data = showAPIFetchJSON('http://route.showapi.com/341-1', {'page':page,'maxResult':size});
    if not data:
        return None, None;
    try:
        for idx, content in enumerate(data['contentlist']):
            jokeid = hashlib.md5((content['title']+content['text']+content['ct']).encode('UTF-8')).hexdigest();
            data['contentlist'][idx]['id'] = jokeid;
            text = data['contentlist'][idx]['text'];
            if text.find('<') < 0 or text.find('>') < 0:
            	data['contentlist'][idx]['text'] = text.replace('\\n', '\n').replace('\n', '\n').replace('\\r', '').replace('\r', '');
        return data['contentlist'];
    except KeyError:
        return None, None;


# Cut text and remove useless words
__uselessWords = {
    '':True,
    '\r':True,
    '\n':True,
    ' ':True,
    ',':True,
    ':':True,
    '?':True,
    '!':True,
    '"':True,
    '<':True,
    '>':True,
    '/':True,
    '　':True,
    '、':True,
    '，':True,
    '。':True,
    '：':True,
    '？':True,
    '！':True,
    '“':True,
    '”':True,
    '‘':True,
    '’':True,
    '《':True,
    '》':True,
    '；':True,
    '…':True,
    '—':True,
};
with open(config.USELESS_WORDS_FILE, 'r') as f:
    word = f.read();
    while word:
        __uselessWords[word.strip()] = True;
        word = f.read();
def cutText(text):
    words = {};
    for word in jieba.cut(text):
        if word in __uselessWords:
            continue;
        words[word] = True;
    return words.keys();

