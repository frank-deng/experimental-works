#!/usr/bin/env python3
#coding=utf-8

import jieba, json, copy;
import models;

jokes = None;
with open('data.json', 'r') as f:
    jokes = json.loads(f.read());

uselessWords = {
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

with open('uselessWords.txt', 'r') as f:
    word = f.read();
    while word:
        uselessWords[word] = True;
        word = f.read();
    
rejectedCount = 0;
acceptedCount = 0;
wordsBlocked = {}
wordsAccepted = {}

for joke in jokes:
    added = False;
    if 0 == joke['accept']:
        for word in jieba.cut(joke['text']):
            if not wordsBlocked.get(word):
                rejectedCount += 1;
                wordsBlocked[word] = 1;
            elif not added:
                rejectedCount += 1;
                wordsBlocked[word] += 1;
                added = True;
    elif 1 == joke['accept']:
        for word in jieba.cut(joke['text']):
            if not wordsAccepted.get(word):
                acceptedCount += 1;
                wordsAccepted[word] = 1;
            elif not added:
                acceptedCount += 1;
                wordsAccepted[word] += 1;
                added = True;

for w in copy.deepcopy(wordsBlocked):
    if uselessWords.get(w):
        del wordsBlocked[w];
        
jokes2 = [
'''
妹子站在小通道哪里，我刚好要从那过，就和她说：麻烦，借过。结果妹子说：借过可以，什么时候还？？？
''',
'''
课堂上老师点名：“刘华！”\n结果下面一孩子大声回到：“yeah！”\n老师很生气：“为什么不说‘到’？”\n孩子说：“那个字念‘烨’……”
''',
]

#for item in models.getJokes(1, 10):
#    joke = item['text'];
for item in jokes2:
    joke = item;
    for word in jieba.cut(joke):
        wb = 0;
        if wordsBlocked.get(word):
            wb = wordsBlocked[word];
        wa = 0;
        if wordsAccepted.get(word):
            wa = wordsAccepted[word];
        if wb == 0:
            continue;
        p0 = (wb / rejectedCount);
        p1 = rejectedCount / (rejectedCount + acceptedCount);
        p2 = (wa + wb) / (rejectedCount + acceptedCount);
        print(word, p0 * p1 / p2);
    print(joke);
    print('');

