#ifndef random_h
#define random_h

#include <stdint.h>

#define RAND_N 624
#define RANDOM_MAX (0xffffffff)

typedef struct {
    uint32_t mt[RAND_N];
    uint16_t index;
} rand_t;

#ifdef __cplusplus
extern "C" {
#endif

void initRandom(rand_t*, uint32_t);
uint32_t getRandom(rand_t*);

#ifdef __cplusplus
}
#endif

#endif
