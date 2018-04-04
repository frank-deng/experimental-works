#!/usr/bin/env python3

import sys, math, array;
import numpy as np;
from PIL import Image;

class ImgVector:
    vecs = [];
    def __init__(self, im):
        imData = im.load();
        w, h = im.size;
        self.w, self.h = w, h;
        for y in range(h):
            for x in range(w):
                px = imData[x, y];
                self.vecs.append((px[0], px[1], px[2]));

class KMeans:
    def __init__(self, _data):
        self.__data = _data;

    def __getMinDistance(self, vec, types):
        vecs = np.array([vec]*len(types));
        types = np.array(types);
        res = np.square(types-vecs).sum(axis=1);
        idx = np.where(res == res.min())[0][0];
        return idx;

    def __getTypesMap(self, data, types):
        result = [None] * len(data);
        for i, vec in enumerate(data):
            result[i] = self.__getMinDistance(vec, types);
        return result;

    def __getCenter(self, data, types, typesMap):
        #result = [[0, 0, 0]] * len(types);
        cntTypes = [0] * len(types);
        result = [];
        for i in range(len(types)):
        	result.append([0, 0, 0]);
        
        for i, vec in enumerate(data):
            _type = typesMap[i];
            result[_type][0] += data[i][0];
            result[_type][1] += data[i][1];
            result[_type][2] += data[i][2];
            cntTypes[_type] += 1;

        for i in range(len(result)):
            if (0 != cntTypes[i]):
                result[i][0] /= cntTypes[i];
                result[i][1] /= cntTypes[i];
                result[i][2] /= cntTypes[i];

        return result;

    def process(self, times = 6):
        types = [
            [0,    0,    0],
            [0,    0,    0x7f],
            [0x7f, 0,    0],
            [0xaa, 0,    0x7f],
            [0,    0x7f, 0],
            [0,    0x7f, 0x7f],
            [0x7f, 0x7f, 0],
            [0xcc, 0xcc, 0xcc],
            [0x7f, 0x7f, 0x7f],
            [0,    0,    0xff],
            [0xff, 0,    0],
            [0xff, 0,    0xff],
            [0,    0xff, 0],
            [0,    0xff, 0xff],
            [0xff, 0xff, 0],
            [0xff, 0xff, 0xff],
        ];
        for cnt in range(times):
            typesMap = self.__getTypesMap(self.__data, types);
            types = self.__getCenter(self.__data, types, typesMap);
        return types, typesMap;
        
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: %s image_file'%sys.argv[0]);
        exit(1);
    srcPath, destPath = sys.argv[1], sys.argv[2];
    
    imgsrc = Image.open(srcPath);
    vec = ImgVector(imgsrc);
    imgsrc.close();
    kMeans = KMeans(vec.vecs);
    palette, imgData = kMeans.process(6);
    destImg = [];
    for px in imgData:
        destImg += [int(n) for n in palette[px]];
    destBytes = array.array('B', destImg).tobytes();
    destImg = Image.frombytes('RGB', imgsrc.size, destBytes);
    destImg.save(destPath);

