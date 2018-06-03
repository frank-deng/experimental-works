#!/usr/bin/env python3
#encoding=UTF-8

import models, pprint;

news = models.fetchNews();
pprint.pprint(news);
print(len(news));
