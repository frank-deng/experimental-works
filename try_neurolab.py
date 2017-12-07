#!/usr/bin/env python3

import csv, math, random;
import numpy as np;
import neurolab as nl;

input = [];
target = [];
data = [];
for x in np.arange(0,1,0.001):
	y = 0.5*x+0.1;
	x1 = x+random.uniform(-0.1, 0.1);
	y1 = y+random.uniform(-0.1, 0.1);
	if (x1>=0 and x1<=1 and y1>=0 and y1<=1):
		input.append([x1]);
		target.append([y1]);
		data.append((x1,y1));

input = np.array(input[:]);
target = np.array(target[:]);
net = nl.net.newff([[0, 120]], [1]);
net.init();
err = net.train(input, target, epochs=1000, show=1, goal=0.0001);

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

theta = newton_method(data);

import matplotlib as mpl;
mpl.use('Agg');

import matplotlib.pyplot as plt;
fig = plt.figure(figsize=(20.48, 15.36));
ax = fig.add_subplot(1,1,1);

ax.scatter(input, target, s=4, c='#006600');
x_data = list(np.arange(0,1,0.01));
ax.plot(x_data, [theta[0]+theta[1]*n for n in x_data], '-', lw=2, color='#ff0000');
ax.plot(x_data, [net.sim([[n]])[0] for n in x_data], '-', lw=2, color='#0000ff');
fig.savefig('/sdcard/devel/plot.png', bbox_inches='tight', pad_inches=0);

exit();
