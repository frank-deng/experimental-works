#!/usr/bin/env python3
#coding=utf-8

import sys, models, json;
jsonData = [];
for joke in models.getJokes(1, int(sys.argv[1])):
    jsonData.append({
        'text':joke['text'],
        'accept':0,
    });
sys.stdout.write(json.dumps(jsonData, ensure_ascii=False, sort_keys=True, indent=4, separators=(',', ': ')));
