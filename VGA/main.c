#include <stdio.h>
#include "util.h"
#include "vga.h"
#include "bmp.h"

int main(int argc, char *argv[])
{
    initDisp0();
    //clearScreen();
    drawBMP("moonrivr.bmp", 0, 0);
    waitkey();
    closeDisp();
    return 0;
}