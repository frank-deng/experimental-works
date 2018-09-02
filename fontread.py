#!/usr/bin/env python3

from PIL import Image, ImageOps;

def writeAsciiToImage(src, dest, text, line):
    idx = 0;
    for char in text:
        n = ord(char);
        charImg = src.crop((n*8, 0, n*8+8, 16));
        dest.paste(charImg, (idx*8, line*16));
        idx += 1;

if '__main__' == __name__:
    im = Image.open('../font.png');
    newIm = Image.new('RGB', (40, 17*16), '#800000');
    writeAsciiToImage(im, newIm, '    .', 0);
    for n in range(16):
        writeAsciiToImage(im, newIm, '%5u'%(1<<(n+1)), n+1);
    newIm = ImageOps.invert(newIm);
    newIm.save('../output.png');

