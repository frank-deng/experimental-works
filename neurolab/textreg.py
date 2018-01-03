#!/usr/bin/env python3

import struct;
import numpy as np;
import neurolab as nl;

class TextDotMatrix:
    def __init__(self, fname):
        with open('ASC16', 'rb') as f:
	        self.__fontData = f.read();
	
    def get(self, asc):
        bytes = self.__fontData[asc*16 : (asc+1)*16];
        bytes = struct.unpack('16B', bytes);
        return [[int(bool(b & (1 << (7-i)))) for i in range(8)] for b in bytes];
		
if __name__ == '__main__':
    font = TextDotMatrix('ASC16');
    trainData = [];
    trainGoal = [];
    for ch in range(32, 127):
        fontData = [];
        for row in font.get(ord('B')):
            fontData += row;
        trainData.append(fontData);
        trainGoal.append([int(bool(ch & (1 << (7-i)))) for i in range(8)]);
    trainData = np.array(trainData);
    trainGoal = np.array(trainGoal);
    
    net = nl.net.newff(
        [[0, 1]] * (8*16),
        [8*16, 6*16, 2*16, 8],
        [nl.trans.LogSig(), nl.trans.LogSig(), nl.trans.LogSig(), nl.trans.LogSig()]
    );
    net.trainf = nl.train.train_gd;
    net.init();
    net.train(trainData, trainGoal, epochs=10000, show=1000, goal=0.0001, lr=0.0002);
    
    
    

    