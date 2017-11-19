#!/usr/bin/env python3
# -*- coding: utf-8 -*-

data = [
    (1.5, 50),
    (1.5, 60),
    (1.6, 40),
    (1.6, 60),
    (1.7, 60),
    (1.7, 80),
    (1.8, 60),
    (1.8, 90),
    (1.9, 70),
    (1.9, 80),
];
labels = [
    'thin',
    'fat',
    'thin',
    'fat',
    'thin', 
    'fat',
    'thin', 
    'fat',
    'thin', 
    'fat',
];

import sys;
import numpy as np  
import scipy as sp  
from sklearn import tree  
from sklearn.metrics import precision_recall_curve, classification_report  
from sklearn.cross_validation import train_test_split 

x = np.array(data);
labels = np.array(labels);
y = np.zeros(labels.shape);
y[labels=='fat']=1

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size = 0.2);

clf = tree.DecisionTreeClassifier(criterion='entropy');
clf.fit(x_train, y_train);

tree.export_graphviz(clf, out_file=sys.stdout);
print('');
print(clf.feature_importances_);

answer = clf.predict(x_train);
print(x_train);
print(answer);
print(y_train);
print(np.mean(answer==y_train));

precision, recall, thresholds = precision_recall_curve(y_train, clf.predict(x_train))  
answer = clf.predict_proba(x)[:,1]  
print(classification_report(y, answer, target_names = ['thin', 'fat']))

