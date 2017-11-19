#!/usr/bin/env python3
#-*-coding:utf8;-*-
#qpy:3
#qpy:console

DATA_FILE='data.csv';

import csv, math;
data = [];
with open(DATA_FILE) as fp:
    for row in csv.reader(fp):
        data.append(tuple([float(n) for n in row]));
        
def check_delta(delta):
    for d in delta:
        if math.isnan(d):
            raise ValueError('Divergency detected');
        elif math.fabs(d) >= 0.0001:
            return False;
    return True;

def h(theta,x):
    return theta[0] + theta[1] * x;

def j(theta):
    sum = 0.0;
    for x, y in data:
        sum += (h(theta, x) - y) ** 2;
    return sum / 2 / len(data);

def j0(theta):
    sum = 0.0;
    for x, y in data:
        sum += h(theta, x) - y;
    return sum / len(data);

def j1(theta):
    sum = 0.0;
    for x, y in data:
        sum += (h(theta, x) - y) * x;
    return sum / len(data);

def gradient(rate, d):
    t = [0.0, 0.0]; delta = [None, None];
    while True:
        delta[0] = (j([t[0]+d, t[1]]) - j(t)) / d;
        delta[1] = (j([t[0], t[1]+d]) - j(t)) / d;
        t[0] -= rate * delta[0];
        t[1] -= rate * delta[1];
        if check_delta(delta):
            break;
    return t;
            
def gradient2(rate):
    t = [0.0, 0.0]; delta = [None, None];
    while True:
        delta[0] = j0(t);
        delta[1] = j1(t);
        t[0] -= rate * delta[0];
        t[1] -= rate * delta[1];
        if check_delta(delta):
            break;
    return t;

print(gradient2(0.0005));
print(gradient(0.0005, 0.00001));
exit();
