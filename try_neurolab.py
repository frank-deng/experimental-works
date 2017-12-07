#!/usr/bin/env python3

import csv, math;
import numpy as np;
import neurolab as nl;

input = [];
target = [];
data = [];
with open('data.csv') as fp:
    for row in csv.reader(fp):
        x, y = float(row[0])/120.0, float(row[1])/120.0
        input.append([x]);
        target.append([y]);
        data.append((x,y));

input = np.array(input[:]);
target = np.array(target[:]);
net = nl.net.newff([[-1, 1]], [1]);
net.init();
err = net.train(input, target, epochs=1000, show=1, goal=0.0001);
for layer in net.layers:
    print(layer.np);

def newton_method(data):
    t = np.mat([[0.0], [0.0]]);
    j0 = j1 = 1;
    acc = 0.000001;
    while math.fabs(j0)>acc or math.fabs(j1)>acc:
        t0, t1 = np.asarray(t)[0][0], np.asarray(t)[1][0];
        a = 1;
        b = d = j0 = j1 = 0;
        for x, y in data:
            b += x;
            d += x*x;
            h = t0 + t1 * x;
            j0 += h - y;
            j1 += (h - y) * x;
        b /= len(data);
        c = b;
        d /= len(data);
        j0 /= len(data);
        j1 /= len(data);
        hessian = np.mat([[a, b], [c, d]]);
        t -= np.dot(hessian.I, np.mat([[j0], [j1]]));
    return np.asarray(t)[0][0], np.asarray(t)[1][0];

print(newton_method(data));
exit();
