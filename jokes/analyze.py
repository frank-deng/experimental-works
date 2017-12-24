#!/usr/bin/env python3
#coding=utf-8

import jieba, json;
from math import log;
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
        uselessWords[word.strip()] = True;
        word = f.read();

wordsAccepted, wordsBlocked = {}, {}
wa, wb = {}, {}
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
        
rejectedCount = sum(wordsBlocked.values());
acceptedCount = sum(wordsAccepted.values());
for w in wordsAccepted:
    wordsAccepted[w] = log((wordsAccepted[w] + 1) / (acceptedCount + 2));
for w in wordsBlocked:
    wordsBlocked[w] = log((wordsBlocked[w] + 1) / (rejectedCount + 2));

jokes2 = [
{'text':'妹子站在小通道哪里，我刚好要从那过，就和她说：麻烦，借过。结果妹子说：借过可以，什么时候还？？？'},
{'text':'课堂上老师点名：“刘华！”\n结果下面一孩子大声回到：“yeah！”\n老师很生气：“为什么不说‘到’？”\n孩子说：“那个字念‘烨’……”'},
{"text": "在火车上想泡面吃，拿着调料袋甩啊甩的。。。一不小心嗖地就飞出去了，定睛一看，一个满头调料的男子转过身来，悠悠的说道：“姑娘，你是想泡我吗？”"},
]

for joke in models.getJokes(1, 80):
#for joke in jokes2:
    words = {};
    for word in jieba.cut(joke['text']):
        words[word] = True;
    pa, pb = 0, 0;
    for word in words:
        pa += wordsAccepted.get(word, 1 / (acceptedCount + 1));
        pb += wordsBlocked.get(word, 1 / (rejectedCount + 1));
    print(pa, pb, pa < pb);
    print(joke);
    print('');

