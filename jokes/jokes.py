#!/usr/bin/env python3
#coding=utf-8

import models, jieba;
for joke in models.getJokes(1, 80):
    print(joke['text']);
    words = list(jieba.cut(joke['text']));
    print(words);
    print('');
