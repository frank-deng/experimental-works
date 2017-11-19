#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class Label:
    Buying = ('low', 'med', 'high', 'vhigh');
    Maint = ('low', 'med', 'high', 'vhigh');
    Doors = ('2', '3', '4', '5more');
    Persons = ('2', '4', 'more');
    LugBoot = ('small', 'med', 'big');
    Safety = ('low', 'med', 'high');
    Class = ('unacc', 'acc', 'good', 'vgood');

data = [];
labels = [];

import sys, csv;
with open('car.data', 'r') as f:
    csvdata = csv.reader(f);
    for row in csvdata:
        data.append((
            Label.Buying.index(row[0]),
            Label.Maint.index(row[1]),
            Label.Doors.index(row[2]),
            Label.Persons.index(row[3]),
            Label.LugBoot.index(row[4]),
            Label.Safety.index(row[5]),
        ));
        labels.append(Label.Class.index(row[-1]));

import numpy as np  
data = np.array(data);
labels = np.array(labels);

import scipy as sp  
from sklearn import tree, metrics;
from sklearn.cross_validation import train_test_split 
from sklearn.externals.six import StringIO;

x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size = 0.2);
clf = tree.DecisionTreeClassifier(criterion='entropy');
clf.fit(x_train, y_train);

print(metrics.accuracy_score(
    y_train,
    clf.predict(x_train), 
));
print(metrics.accuracy_score(
    y_test,
    clf.predict(x_test), 
));

import pydot;
dot_data = StringIO();
tree.export_graphviz(
    clf,
    out_file=dot_data,
    feature_names=('Buying', 'Maint', 'Doors', 'Persons', 'LugBoot', 'Safety'),  
    class_names=Label.Class,
    filled=True,
    rounded=True,  
    special_characters=True
);
graph = pydot.graph_from_dot_data(dot_data.getvalue());
graph.write_pdf("decision_tree.pdf");

