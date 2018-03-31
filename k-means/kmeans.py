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
        
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: %s image_file'%sys.argv[0]);
        exit(1);

    vec = ImgVector(Image.open(sys.argv[1]));

