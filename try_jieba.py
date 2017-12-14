#!/usr/bin/env python3
#coding=utf-8
import jieba

cut_all=False;
jieba.add_word('博丽灵梦');

tokens = jieba.cut('手机变手雷，就在开车低头一瞬间', cut_all=cut_all);
print(' '.join(tokens));

tokens = jieba.cut('手持两把锟斤拷，口中疾呼烫烫烫', cut_all=cut_all);
print(' '.join(tokens));

tokens = jieba.cut('博丽灵梦', cut_all=cut_all);
print(' '.join(tokens));