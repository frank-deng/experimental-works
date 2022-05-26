#ifndef guessnum_h
#define guessnum_h

#include <stdbool.h>

#define max(x, y) ((x) > (y) ? (x) : (y))
#define min(x, y) ((x) < (y) ? (x) : (y))

#define BCD_INVALID_NUM (0xffff)

#ifndef MASTERMIND
#define GUESS_CHANCES 12
#else
#define GUESS_CHANCES 15
#endif

#ifdef __cplusplus
extern "C" {
#endif

uint8_t check(uint16_t, uint16_t);
uint16_t int2bcd(uint16_t);
void init();
uint8_t guess(unsigned int *);

#ifdef __cplusplus
}
#endif

#endif
