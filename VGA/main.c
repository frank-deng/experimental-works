#include <stdio.h>
#include <stdlib.h>
#include <dos.h>
#include "util.h"
#include "vga.h"
#include "bmp.h"

int main(int argc, char *argv[])
{
    int i;
    uint16_t offset = 0;
    initDisp();
    clearScreen();
    drawBMP("test.bmp", 0, 0);
    waitkey();
    for (i = 0; i < 40; i++) {
        offset += 10*80;
        setVramOffset(offset);
        delay(20);
    }
    waitkey();
    closeDisp();
    return 0;
}

