#ifndef __vga_h__
#define __vga_h__

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
    INSTR(mov dx, GC_INDEX)\
    INSTR(mov al, GRAPHICS_MODE)\
    "out dx,al"\
    "inc dx"\
    "in al,dx"\
    "and al,not 0x10"\
    "out dx,al"\
    "dec dx"\
    INSTR(mov al, MISC)\
    "out dx,al"\
    "inc dx"\
    "in al,dx"\
    "and al,not 0x02"\
    "out dx,al"\
    INSTR(mov dx, CRTC_INDEX)\
    INSTR(mov al, MAX_SCANLINE)\
    "out dx,al"\
    "inc dx"\
    "in al,dx"\
    "and al,not 0x1f"\
    "out dx,al"\
    "dec dx"\
    INSTR(mov al, UNDERLINE)\
    "out dx,al"\
    "inc dx"\
    "in al,dx"\
    "and al,not 0x40"\
    "out dx,al"\
    "dec dx"\
    INSTR(mov al, MODE_CTRL)\
    "out dx,al"\
    "inc dx"\
    "in al,dx"\
    "or al,0x40"\
    "out dx,al"\
    modify [ax bx cx dx es si di]

__inline void closeDisp();
#pragma aux closeDisp = \
    "mov ax, 0x0003" \
    "int 0x10" \
    modify [ax]

#ifdef __cplusplus
}
#endif

#endif
