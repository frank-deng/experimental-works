#!/usr/bin/env python3

import csv, math, random;
import numpy as np;
import neurolab as nl;

trainData = [];
trainTarget = [];
for x in np.arange(-1,1,0.001):
    y = math.sin(math.pi/4*x);
    trainData.append(x);
    trainTarget.append(y);

trainDataNp = np.array([[n] for n in trainData]);
trainTargetNp = np.array([[n] for n in trainTarget]);
net = nl.net.newff([[-1, 1]], [2, 2, 1], [nl.trans.TanSig(), nl.trans.TanSig(), nl.trans.PureLin()]);
net.init();
err = net.train(trainDataNp, trainTargetNp, epochs=1000, show=1, goal=0.0001);

import matplotlib as mpl;
mpl.use('Agg');

import matplotlib.pyplot as plt;
fig = plt.figure(figsize=(20.48, 15.36));
ax = fig.add_subplot(1,1,1);

ax.scatter(trainData, trainTarget, s=4, c='#006600');
ax.plot(trainData, [net.sim([[n]])[0] for n in trainData], '-', lw=2, color='#0000ff');
fig.savefig('/sdcard/devel/plot.png', bbox_inches='tight', pad_inches=0);
exit();

