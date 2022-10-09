#ifndef __vga_h__
#define __vga_h__

#ifdef __cplusplus
extern "C" {
#endif

__inline void initDisp();
#pragma aux initDisp = \
    "mov ax, 0x0013" \
    "int 0x10" \
    modify [ax]

__inline void closeDisp();
#pragma aux closeDisp = \
    "mov ax, 0x0003" \
    "int 0x10" \
    modify [ax]

#ifdef __cplusplus
}
#endif

#endif
