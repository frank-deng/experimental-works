#!/usr/bin/env python3
#coding=utf-8

import jieba, json;

jokes = None;
with open('data.json', 'r') as f:
    jokes = json.loads(f.read());
    
wordsBlocked = {}
wordsAccepted = {}

for joke in jokes:
	if 0 == joke['accept']:
		for word in jieba.cut(joke['text']):
			if not wordsBlocked.get(word):
				wordsBlocked[word] = 1;
			else:
			    wordsBlocked[word] += 1;
	elif 1 == joke['accept']:
		for word in jieba.cut(joke['text']):
			if not wordsAccepted.get(word):
				wordsAccepted[word] = 1;
			else:
			    wordsAccepted[word] += 1;

for w in wordsBlocked:
	print("%s,%s,%s"%(w, wordsAccepted.get(w), wordsBlocked.get(w)));

