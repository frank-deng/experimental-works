#!/usr/bin/env python3
#coding=utf-8

import jieba, json;
from math import log;
import models;

jokes = None;
with open('data.json', 'r') as f:
    jokes = json.loads(f.read());

wordsAccepted, wordsBlocked = {}, {}
wa, wb = {}, {}
for joke in jokes:
    wa.clear();
    wb.clear();
    if 1 == joke['accept']:
        for word in models.cutText(joke['text']):
        #for word in jieba.cut(joke['text']):
        #    if word in uselessWords:
        #        continue;
            wa[word] = wa.get(word, 1);
    elif 0 == joke['accept']:
        for word in models.cutText(joke['text']):
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

# Test classifier
passed = True;
for joke in jokes:
    pa = log(acceptedCount / (acceptedCount + rejectedCount));
    pb = log(rejectedCount / (acceptedCount + rejectedCount));
    for word in models.cutText(joke['text']):
        pa += wordsAccepted.get(word, 0);
        pb += wordsBlocked.get(word, 0);
    accepted = (pa < pb);
    if bool(joke['accept']) != accepted:
        passed = False;

if (passed):
    print('Test on training cases passed.');
else:
    print('Test on training not passed.');
    exit(1);

jokesTest = None;
good, bad = 0, 0;
with open('test.json', 'r') as f:
    jokesTest = json.loads(f.read());

for joke in jokesTest:
    words = {};
    for word in jieba.cut(joke['text']):
        words[word] = True;
    pa = log(acceptedCount / (acceptedCount + rejectedCount))
    pb = log(rejectedCount / (acceptedCount + rejectedCount))
    for word in words:
        pa += wordsAccepted.get(word, 0);
        pb += wordsBlocked.get(word, 0);
    accepted = (pa < pb);

    if bool(joke['accept']) != accepted:
        bad += 1;
    else:
        good += 1;

print(good, bad);

