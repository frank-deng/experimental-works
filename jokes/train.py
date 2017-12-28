#!/usr/bin/env python3
#coding=utf-8

import jieba, json, sys;
from math import log;
from models import cutText, getJokes, getTrainingData, processTrainingData;
from BayesClassifier import BayesClassifier;

jokes = getTrainingData('train_data/');
wordsAccepted, wordsBlocked = processTrainingData(jokes);
classifier = BayesClassifier(('accepted', 'rejected'));
classifier.train({'accepted':wordsAccepted, 'rejected':wordsBlocked});

# Test classifier
passed = True;
for joke in jokes:
    accepted = classifier.classify(cutText(joke['text']));
    if bool(joke['accept']) != (accepted == 'accepted'):
        passed = False;

if (not passed):
    print('Test on training not passed.');
    exit(1);

sys.stdout.write(json.dumps(classifier.getTrainedData(), ensure_ascii=False, sort_keys=True, indent=4, separators=(',', ': ')));

