#ifndef __bmp_h__
#define __bmp_h__

#include <stdio.h>
#include <string.h>

typedef struct {
    unsigned short magicNum;
    unsigned long size;
    unsigned short res;
    unsigned short res2;
    unsigned long dataOffset;
    unsigned long headerSize;
    long width;
    long height;
    unsigned short planes;
    unsigned short bpp;
    unsigned long compression;
    unsigned long imageSize;
    long xres;
    long yres;
    unsigned long res3;
    unsigned long res4;
} bmpHeader_t;
typedef struct {
    uint8_t b;
    uint8_t g;
    uint8_t r;
    uint8_t a;
} bmpPaletteItem_t;

#ifdef __cplusplus
extern "C" {
#endif

int drawBMP(char *path, uint16_t x, uint16_t y);

#ifdef __cplusplus
}
#endif

#endif

