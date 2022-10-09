#ifndef __util_h__
#define __util_h__

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

__inline void waitkey();
#pragma aux waitkey = \
    "mov ah, 0" \
    "int 0x16" \
    modify [ah]

#ifdef __cplusplus
}
#endif

#endif