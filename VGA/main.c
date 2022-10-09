#include <stdio.h>
#include "util.h"
#include "vga.h"

uint8_t far *vbuf=0xa0000000;

int main(int argc, char *argv[])
{
    initDisp();
    puts("/123456789012345678901234567890123456789");
    vbuf[0]=0x1;
    vbuf[1]=0x23;
    vbuf[2]=0x45;
    vbuf[3]=0x26;
    waitkey();
    closeDisp();
    return 0;
}
