#!/usr/bin/env python3

import numpy as np;
import neurolab as nl;

trainData = np.array([
    (0, 0),
    (0, 1),
    (1, 0),
    (1, 1),
]);
trainResult = np.array([[a ^ b] for a, b in trainData]);
transFunc = nl.trans.TanSig();
net = nl.net.newff([[0, 1], [0, 1]], [2, 1], [transFunc, transFunc]);
err = net.train(trainData, trainResult, epochs=1000, show=1, goal=0.0001)[-1];

for a, b in trainData:
    print(net.sim([[a, b]]));

print(trainResult);
