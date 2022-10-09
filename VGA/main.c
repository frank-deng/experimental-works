#include <stdio.h>
#include "util.h"
#include "vga.h"

uint8_t far *vbuf=0xa0000000;

int main(int argc, char *argv[])
{
    initDisp();
    selectPlane(0x7);
    _fmemset(vbuf,2,0xffff);
    selectPlane(0x8);
    puts("/12345678901234567890123456789K12345678A");
    
    vbuf[0]=0x1;
    vbuf[1]=0x23;
    vbuf[2]=0x45;
    vbuf[3]=0x26;

    waitkey();
    closeDisp();
    return 0;
}