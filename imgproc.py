#!/usr/bin/env python3

import math;
from PIL import Image;

class ImgVector:
    __im = None;
    __px = None;
    def __init__(self, im):
        self.__im = im;
        self.__areas = ((0,0,1,1),);
        self.__px = self.__im.load();
    
    def setAreas(self, areas):
        self.__areas = areas;
        
    def __processArea(self,l,t,r,b):
        a1, b1, c1 = 0, 0, 0;
        count = (r-l)*(b-t);
        for y in range(t,b):
            for x in range(l,r):
                px = self.__px[x, y];
                a1 += px[0];
                b1 += px[1];
                c1 += px[2];
        return (a1/count, b1/count, c1/count);
        
    def getVector(self):
        vecs = [];
        w,h = self.__im.size;
        for l,t,r,b in self.__areas:
            vecs.append(self.__processArea(int(w*l), int(h*t), int(w*r), int(h*b)));
        v = [0, 0, 0];
        for vec in vecs:
            v[0] += vec[0];
            v[1] += vec[1];
            v[2] += vec[2];
        v[0] /= len(vecs);
        v[1] /= len(vecs);
        v[2] /= len(vecs);
        return v;

def veclen(vec):
    result = 0;
    for x in vec:
        result += x*x;
    return math.sqrt(result);

def veccos(v0, v1):
    a = 0;
    for i in range(len(v0)):
        a += v0[i] * v1[i];
    return a/veclen(v0)/veclen(v1);
        
if __name__ == '__main__':
    areas = (
        (0,0, 1/3,1/3),
        (1/3,0, 2/3,1/3),
        (2/3,0, 1,1/3),
        (0,1/3, 1/3,2/3),
        (1/3,1/3, 2/3,2/3),
        (2/3,1/3, 1,2/3),
        (0,2/3, 1/3,1),
        (1/3,2/3, 2/3,1),
        (2/3,2/3, 1,1),
    );
    image = Image.open('touhou/reimu1.jpg');
    iv = ImgVector(image);
    iv.setAreas(areas);
    v0 = iv.getVector();

    image2 = Image.open('touhou/reimu2.jpg');
    iv2 = ImgVector(image2);
    iv2.setAreas(areas);
    v1 = iv2.getVector();

    image3 = Image.open('touhou/marisa2.jpg');
    iv3 = ImgVector(image3);
    iv3.setAreas(areas);
    v2 = iv3.getVector();

    image4 = Image.open('touhou/marisa.gif');
    iv4 = ImgVector(image4);
    iv4.setAreas(areas);
    v3 = iv4.getVector();

    print(veccos(v0, v1));
    print(veccos(v0, v2));
    print(veccos(v0, v3));
    exit(0);
