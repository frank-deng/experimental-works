#include "vga.h"
#include "bmp.h"

static __inline void setPalette(uint8_t entry, uint8_t r, uint8_t g, uint8_t b);
#pragma aux setPalette = \
    "mov dx,0x3c6"\
    "mov al,0xff"\
    "out dx,al"\
    "mov dx,0x3c8"\
    "mov al,cl"\
    "out dx,al"\
    "inc dx"\
    "mov al,ah"\
    "out dx,al"\
    "mov al,bl"\
    "out dx,al"\
    "mov al,bh"\
    "out dx,al"\
    modify [ax bx dx]\
    parm [cl] [ah] [bl] [bh]

int drawBMP(char *path, uint16_t x, uint16_t y)
{
    FILE *fp = NULL;
    bmpHeader_t header;
    bmpPaletteItem_t palette[256];
    uint8_t lineBuf[SCREEN_WIDTH], plane;
    uint16_t i, j, row, rowSize;
    uint32_t offset;

    fp = fopen(path, "rb");
    fread(&header, sizeof(bmpHeader_t), 1, fp);
    fseek(fp, sizeof(header), SEEK_SET);
    fread(palette, sizeof(bmpPaletteItem_t), (1 << header.bpp), fp);
    for (i = 0; i < (1 << header.bpp); i++) {
        setPalette(i, palette[i].r, palette[i].g, palette[i].b);
    }
    rowSize = ((header.width + 0x1f) >> 5) << 5;
    for (row = header.height; row > 0; row--) {
        fseek(fp, header.dataOffset + (header.height - row) * rowSize, SEEK_SET);
        fread(lineBuf, header.width, 1, fp);
        for (j = 0; j < header.width; j++) {
            selectPlane(1<<(j & 3));
            offset = (row - 1) * (SCREEN_WIDTH >> 2) + (j >> 2);
            *(((uint8_t far*)vmem) + offset) = lineBuf[j];
        }
    }
    fclose(fp);
    return 0;
}
