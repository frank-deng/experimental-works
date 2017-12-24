#!/usr/bin/env python3
#coding=utf-8

import models, json;
jsonData = [];
for joke in models.getJokes(1, 80):
    jsonData.append({
        'text':joke['text'],
        'accept':0,
    });
with open('data.json', 'w') as f:
    f.write(json.dumps(jsonData, ensure_ascii=False, sort_keys=True, indent=4, separators=(',', ': ')));
