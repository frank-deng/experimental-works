#!/usr/bin/env python3
#coding=utf-8

import jieba, json;
from math import log;
from models import cutText, getJokes, getTrainingData, processTrainingData;
from BayesClassifier import BayesClassifier;

classifier = BayesClassifier(('accepted', 'rejected'));
with open('train.json', 'r') as f:
    classifier.train(json.loads(f.read()));

# Test classifier
passed = True;
for joke in getTrainingData('train_data'):
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
for joke in jokesTest:
    accepted = classifier.classify(cutText(joke['text']));
    if bool(joke['accept']) != (accepted == 'accepted'):
        bad += 1;
    else:
        good += 1;
        print(joke['text']);
        print('======');

print(good, bad);

good, bad = 0, 0;
for joke in getJokes(1, 80):
    accepted = classifier.classify(cutText(joke['text']));
    if (accepted == 'accepted'):
        good += 1;
        print(joke['text']);
        print('======');
    else:
        bad += 1;
print(good, bad)

