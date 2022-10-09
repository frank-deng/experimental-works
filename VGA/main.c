#include <stdio.h>
#include "util.h"
#include "vga.h"

int main(int argc, char *argv[])
{
    initDisp();
    puts("ok");
    waitkey();
    closeDisp();
    return 0;
}