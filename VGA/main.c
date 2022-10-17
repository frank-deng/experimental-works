#include <stdio.h>
#include <stdlib.h>
#include <dos.h>
#include "logger.h"
#include "util.h"
#include "vga.h"
#include "bmp.h"

int main(int argc, char *argv[])
{
    int i;
    uint16_t offset = 0;
    logger_init("1.log");
    initDisp();
    clearScreen();
    drawBMP("test.bmp", 0, 0);
    waitkey();
    LOG("%d", 666);
    for (i = 0; i < 40; i++) {
        offset += 10*80;
        setVramOffset(offset);
        delay(20);
    }
    waitkey();
    LOG("%d", 2333);
    closeDisp();
    logger_close();
    return 0;
}
