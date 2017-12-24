#!/usr/bin/env python3
#coding=utf-8

import jieba, json;
from math import log;
from models import cutText, getJokes;
from BayesClassifier import BayesClassifier;

jokes = None;
with open('data.json', 'r') as f:
    jokes = json.loads(f.read());

classifier = BayesClassifier(('accepted', 'rejected'));

#wordsAccepted, wordsBlocked = [], []
wordsAccepted, wordsBlocked = {}, {}
wa, wb = {}, {}
for joke in jokes:
    wa.clear();
    wb.clear();
    if 1 == joke['accept']:
        for word in cutText(joke['text']):
            wa[word] = wa.get(word, 1);
    elif 0 == joke['accept']:
        for word in cutText(joke['text']):
            wb[word] = wb.get(word, 1);
#    for w in wa:
#        wordsAccepted += list(wa.keys());
#    for w in wb:
#        wordsBlocked += list(wb.keys());
    for w in wa:
        wordsAccepted[w] = wordsAccepted.get(w, 0) + wa[w];
    for w in wb:
        wordsBlocked[w] = wordsBlocked.get(w, 0) + wb[w];
        
#classifier.train({'accepted':wordsAccepted, 'rejected':wordsBlocked});
classifier.train({'accepted':wordsAccepted, 'rejected':wordsBlocked});

# Test classifier
passed = True;
for joke in jokes:
    accepted = classifier.classify(cutText(joke['text']));
    if bool(joke['accept']) != (accepted == 'accepted'):
        passed = False;

if (passed):
    print('Test on training cases passed.');
else:
    print('Test on training not passed.');
    exit(1);

with open('test.json', 'r') as f:
    jokesTest = json.loads(f.read());

good, bad = 0, 0;
for joke in getJokes(1, 80):
    accepted = classifier.classify(cutText(joke['text']));
    if (accepted == 'accepted'):
        good += 1;
    else:
        bad += 1;
print(good, bad)
