#!/usr/bin/env python3

import sys, math;
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
        idx = 0; minDist = None;
        for i, tvec in enumerate(types):
            dist = ((tvec[0] - vec[0]) ** 2) + ((tvec[1] - vec[1]) ** 2) + ((tvec[2] - vec[2]) ** 2);
            if (0 == i or dist < minDist):
                idx = i;
                minDist = dist;
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
            [0,    0,    0xaa],
            [0xaa, 0,    0],
            [0xaa, 0,    0xaa],
            [0,    0xaa, 0],
            [0,    0xaa, 0xaa],
            [0xaa, 0xaa, 0],
            [0xcc, 0xcc, 0xcc],
            [0x77, 0x77, 0x77],
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
        return types;
        
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: %s image_file'%sys.argv[0]);
        exit(1);

    vec = ImgVector(Image.open(sys.argv[1]));
    kMeans = KMeans(vec.vecs);
    result = kMeans.process(6);
    for row in result:
        print(row);

