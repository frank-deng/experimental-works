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

wordsAccepted = {}
wordsBlocked = {}
wa = {}
wb = {}

for joke in jokes:
    wa.clear();
    wb.clear();
    if 1 == joke['accept']:
        for word in jieba.cut(joke['text']):
            if word in uselessWords:
                continue;
            wa[word] = wa.get(word, 1);
    elif 0 == joke['accept']:
        for word in jieba.cut(joke['text']):
            if word in uselessWords:
                continue;
            wb[word] = wb.get(word, 1);
    for w in wa:
        wordsAccepted[w] = wordsAccepted.get(w, 0) + wa[w];
    for w in wb:
        wordsBlocked[w] = wordsBlocked.get(w, 0) + wb[w];
        
rejectedCount = 0;
for w in wordsBlocked:
	rejectedCount += wordsBlocked[w];
acceptedCount = 0;
for w in wordsAccepted:
	acceptedCount += wordsAccepted[w];
        
jokes2 = [
{'text':'妹子站在小通道哪里，我刚好要从那过，就和她说：麻烦，借过。结果妹子说：借过可以，什么时候还？？？'},
{'text':'课堂上老师点名：“刘华！”\n结果下面一孩子大声回到：“yeah！”\n老师很生气：“为什么不说‘到’？”\n孩子说：“那个字念‘烨’……”'},
]

#for item in models.getJokes(1, 10):
for item in jokes2:
    joke = item['text'];
    words = {};
    for word in jieba.cut(joke):
        words[word] = True;
        
    pa, pb = 0, 0;
    for word in words:
        wa = wordsAccepted.get(word, 0);
        wb = wordsBlocked.get(word, 0);
        if wa == 0 and wb == 0:
            continue;
        pa1 = (wa + 1) / (acceptedCount + 2);
        pb1 = (wb + 1) / (rejectedCount + 2);
        if pa == 0:
            pa = pa1;
        else:
            pa *= pa1;
        if pb == 0:
            pb = pb1;
        else:
            pb *= pb1;
        print(pa1, pb1);
    print(pa, pb, pa > pb);
    print(joke);
    print('');

