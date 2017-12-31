#!/usr/bin/env python3

import struct;
from random import randint;
import numpy as np;
import neurolab as nl;

def num2bin(num):
    n = struct.unpack('I', struct.pack('i', num))[0];
    result = bin(n).replace('0b','');
    return '0'*(32-len(result)) + result;

def classifyNum(num):
    t = ('0001', '0010' , '0100', '1000');
    n = int(num < 0) | (int(num & 1 != 0) << 1);
    return t[n];

def getTrainData(cnt):
    trainData = [];
    trainResult = [];
    for i in range(cnt):
        n = randint(-32768, 32767);
        trainData.append([int(b) for b in num2bin(n)]);
        trainResult.append([int(b) for b in classifyNum(n)]);
    return trainData, trainResult;

trainData, trainResult = getTrainData(100);
trainData = np.array(trainData);
trainResult = np.array(trainResult);

transFunc = nl.trans.LogSig();
net = nl.net.newff([[0, 1]] * 32, [32, 10, 4], [transFunc, transFunc, transFunc]);
err = net.train(trainData, trainResult, epochs=1000, show=1, goal=0.0001)[-1];

for i in range(10):
    n = randint(-32768, 32767);
    print(num2bin(n), classifyNum(n), net.sim([[int(b) for b in num2bin(n)]]));

