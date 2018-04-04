#!/usr/bin/env python3

import sys, math, array, time;
import numpy as np;
from PIL import Image;

class ImgVector:
    vecs = [];
    def __init__(self, im):
        imData = im.load();
        for px in imData:
            print(px);
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
        res = np.square(types-vecs).sum(axis=1);
        idx = np.where(res == res.min())[0][0];
        return idx;

    def __getTypesMap(self, data, types):
        result = [];
        for i, vec in enumerate(data):
            result.append(self.__getMinDistance(vec, types));
        return result;

    def __getCenter(self, data, types):
        cntTypes = [0] * len(types);
        result = [];

        for i in range(len(types)):
            result.append([0, 0, 0]);
        
        for vec in data:
            _type = self.__getMinDistance(vec, types);
            result[_type][0] += vec[0];
            result[_type][1] += vec[1];
            result[_type][2] += vec[2];
            cntTypes[_type] += 1;

        for i in range(len(result)):
            if (0 != cntTypes[i]):
                result[i][0] /= cntTypes[i];
                result[i][1] /= cntTypes[i];
                result[i][2] /= cntTypes[i];

        result = np.array(result);
        delta = np.average(np.square(result - types));
        return result, delta;

    def process(self, times = 8):
        types = np.array([
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
        ]);
        for cnt in range(times):
            types, delta = self.__getCenter(self.__data, types);
            print('Delta: ', delta);
            if delta < 6:
                break;
        return types, self.__getTypesMap(self.__data, types);
        
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: %s image_file'%sys.argv[0]);
        exit(1);
    srcPath, destPath = sys.argv[1], sys.argv[2];
    
    imgsrc = Image.open(srcPath);
    vec = ImgVector(imgsrc);
    imgsrc.close();
    kMeans = KMeans(vec.vecs);
    palette, imgData = kMeans.process();
    destImg = [];
    for px in imgData:
        destImg += [int(n) for n in palette[px]];
    destBytes = array.array('B', destImg).tobytes();
    destImg = Image.frombytes('RGB', imgsrc.size, destBytes);
    destImg.save(destPath);

