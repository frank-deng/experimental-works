#!/usr/bin/env python3
#-*-coding:utf8;-*-
#qpy:3
#qpy:console

DATA_FILE='data.csv';

import csv, math, numpy;
data = [];
with open(DATA_FILE) as fp:
    for row in csv.reader(fp):
        data.append(tuple([float(n) for n in row]));
        
def check_delta(delta):
    for d in delta:
        if math.isnan(d):
            raise ValueError('Divergency detected');
        elif math.fabs(d) >= 0.000001:
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

def h00(theta):
    return 1;

def h01(theta):
    sum = 0.0;
    for x, y in data:
        sum += x;
    return sum / len(data);

def h10(theta):
    sum = 0.0;
    for x, y in data:
        sum += x;
    return sum / len(data);

def h11(theta):
    sum = 0.0;
    for x, y in data:
        sum += x*x;
    return sum / len(data);

def newton_method():
    t = numpy.mat([[0.0], [0.0]]);
    while True:
        t0 = (numpy.asarray(t)[0][0], numpy.asarray(t)[1][0]);
        hessian = numpy.mat([
            [h00(t0), h10(t0)],
            [h01(t0), h11(t0)],
        ]);
        delta = numpy.mat([
            [j0(t0)],
            [j1(t0)]
        ]);
        t -= numpy.dot(hessian.I, delta);
        if check_delta(delta):
            break;
    return t;

print(newton_method());
exit();
