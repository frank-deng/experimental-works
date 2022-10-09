#ifndef __vga_h__
#define __vga_h__

#include <stdint.h>

#define SCREEN_WIDTH 320
#define SCREEN_HEIGHT 400

#define STR(...) #__VA_ARGS__
#define INSTR(...) STR(__VA_ARGS__)

#define VGA_SEGMENT 0xa000
#define SC_INDEX 0x3c4
#define GC_INDEX 0x3ce
#define CRTC_INDEX 0x3d4
#define MAP_MASK 2
#define CLOCK_MODE 1
#define MEMORY_MODE 4
#define MAX_SCANLINE 9
#define START_ADDR_HIGH 0x0c
#define UNDERLINE 0x14
#define MODE_CTRL 0x17
#define GRAPHICS_MODE 5
#define MISC 6

#ifdef __cplusplus
extern "C" {
#endif

__inline void initDisp();
#pragma aux initDisp = \
    "mov ax,0x0013"\
    "int 0x10"\
    INSTR(mov dx, SC_INDEX)\
    INSTR(mov al, MEMORY_MODE)\
    "out dx,al"\
    "inc dx"\
    "mov al,0x06"\
    "out dx,al"\
    INSTR(mov dx, CRTC_INDEX)\
    INSTR(mov al, UNDERLINE)\
    "out dx,al"\
    "inc dx"\
    "mov al,0"\
    "out dx,al"\
    INSTR(mov dx, CRTC_INDEX)\
    INSTR(mov al, MODE_CTRL)\
    "out dx,al"\
    "inc dx"\
    "mov al,0xe3"\
    "out dx,al"\
    INSTR(mov dx, CRTC_INDEX)\
    INSTR(mov al, MAX_SCANLINE)\
    "out dx,al"\
    "inc dx"\
    "mov al,0x40"\
    "out dx,al"\
    modify [ax dx]

__inline void selectPlane(uint8_t val);
#pragma aux selectPlane = \
    "and ah,0xf" \
    INSTR(mov dx, SC_INDEX)\
    INSTR(mov al, MAP_MASK)\
    "out dx,al"\
    "inc dx"\
    "in al,dx"\
    "and al,0xf0"\
    "or al,ah"\
    "out dx,al"\
    modify [al dx]\
    parm [ah]

__inline void closeDisp();
#pragma aux closeDisp = \
    "mov ax, 0x0003" \
    "int 0x10" \
    modify [ax]

#ifdef __cplusplus
}
#endif

#endif