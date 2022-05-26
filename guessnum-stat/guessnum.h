#ifndef guessnum_h
#define guessnum_h

#include <stdbool.h>

#define BCD_INVALID_NUM (0xffff)

#ifdef __cplusplus
extern "C" {
#endif

uint8_t check(uint16_t, uint16_t);
uint16_t int2bcd(uint16_t, bool);
void init();
uint8_t guess(unsigned int *);

#ifdef __cplusplus
}
#endif

#endif
