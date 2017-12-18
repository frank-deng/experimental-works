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
        rejectedCount += 1;
        for word in jieba.cut(joke['text']):
            if not wordsBlocked.get(word):
                wordsBlocked[word] = 1;
            elif not added:
                wordsBlocked[word] += 1;
                added = True;
    elif 1 == joke['accept']:
        acceptedCount += 1;
        for word in jieba.cut(joke['text']):
            if not wordsAccepted.get(word):
                wordsAccepted[word] = 1;
            elif not added:
                wordsAccepted[word] += 1;
                added = True;

for w in copy.deepcopy(wordsBlocked):
    if uselessWords.get(w):
        del wordsBlocked[w];

#for w in wordsBlocked:
#    print("%s,%s,%s"%(w, wordsAccepted.get(w), wordsBlocked.get(w)));

pc = rejectedCount / len(jokes);
for joke in models.getJokes(1, 30):
    words0 = list(joke['text']);
    words = {};
    for w in words0:
        words[w] = True;

    pw = 1;
    p1 = 1;
    for word in words:
        if wordsBlocked.get(word):
            if wordsAccepted.get(word):
                p1 *= wordsBlocked[word] / (wordsBlocked[word] + wordsAccepted[word]);
                pw *= (wordsBlocked[word] + wordsAccepted[word]) / len(jokes);
            else:
                pw *= wordsBlocked[word] / len(jokes);
    print(p1 * pc / pw);
    print(joke['text']);

