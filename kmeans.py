#!/usr/bin/env python3

import sys, math, array, time;
import numpy as np;
from PIL import Image;

class ImgVector:
    def __init__(self, im):
        imData = im.load();
        w, h = im.size;
        self.w, self.h = w, h;
        vecs = [];
        for y in range(h):
            for x in range(w):
                px = imData[x, y];
                vecs.append((px[0], px[1], px[2]));
        self.vecs = np.array(vecs);

class KMeans:
    def __getMinDistance(self, vec, types):
        dist = np.square(types - np.array([vec]*len(types))).sum(axis=1);
        idx = np.where(dist == dist.min())[0][0];
        return idx;

    def __getTypesMap(self, data, types):
        result = [];
        for i, vec in enumerate(data):
            result.append(self.__getMinDistance(vec, types));
        return result;

    def __getCenter(self, data, types):
        result = np.zeros(shape=(len(types), 3));
        cnt = [0] * len(types);
        
        ts = time.time();
        for vec in data:
            _type = self.__getMinDistance(vec, types);
            result[_type] += vec;
            cnt[_type] += 1;
        print('Time: ', time.time() - ts);

        for i in range(len(types)):
            if cnt[i] != 0:
                result[i] /= cnt[i];

        result = np.array(result);
        delta = np.average(np.square(result - types));
        return result, delta;

    def process(self, data, times = 8):
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
            types, delta = self.__getCenter(data, types);
            print('Delta: ', delta);
            if delta < 6:
                break;
        return types, self.__getTypesMap(data, types);
        
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: %s image_file'%sys.argv[0]);
        exit(1);
    srcPath, destPath = sys.argv[1], sys.argv[2];
    
    imgsrc = Image.open(srcPath);
    vec = ImgVector(imgsrc);
    imgsrc.close();

    kMeans = KMeans();
    palette, imgData = kMeans.process(vec.vecs);

    destImg = [];
    for px in imgData:
        destImg += [int(n) for n in palette[px]];
    destBytes = array.array('B', destImg).tobytes();
    destImg = Image.frombytes('RGB', imgsrc.size, destBytes);
    destImg.save(destPath);

