#include <stdlib.h>
#include <stdint.h>
#include <time.h>
#include "guessnum.h"

uint16_t int2bcd(uint16_t n)
{
    uint16_t result = 0, map = 0;
    uint8_t offset;
    for (offset = 0; offset < 16; offset += 4) {
        uint16_t digit = (n % 10);
#ifndef MASTERMIND
        if ((map & (1 << digit)) != 0) {
            return BCD_INVALID_NUM;
        }
        map |= (1 << digit);
#endif
        result |= digit << offset;
        n /= 10;
    }
	return result;
}

uint8_t check(uint16_t ans, uint16_t guess)
{
    uint8_t result = 0, i, valAns, valGuess;
#ifndef MASTERMIND
    uint16_t existAns = 0;
    uint16_t existGuess = 0;
#else
    uint8_t existAns[10] = { 0 };
    uint8_t existGuess[10] = { 0 };
#endif

	for (i = 0; i < 4; i++) {
		valAns = ans & 0xf;
		valGuess = guess & 0xf;
        ans >>= 4;
        guess >>= 4;
		if (valAns == valGuess) {
			result += 0x10;
            continue;
		}
#ifndef MASTERMIND
        existAns |= (1 << valAns);
        existGuess |= (1 << valGuess);
#else
        existAns[valAns]++;
        existGuess[valGuess]++;
#endif
	}

#ifndef MASTERMIND
    existGuess &= existAns;
    while (existGuess != 0) {
        result++;
        existGuess = existGuess & (existGuess - 1);
    }
#else
    for (i = 0; i < 10; i++) {
        result += min(existAns[i], existGuess[i]);
    }
#endif

    return result;
}

#ifndef MASTERMIND
#define CANDIDATES_COUNT 5040
#define NUM_START 123
#define NUM_END 9876
#else
#define CANDIDATES_COUNT 10000
#define NUM_START 0
#define NUM_END 9999
#endif

static uint16_t numbers[CANDIDATES_COUNT];
static uint8_t checkTable[CANDIDATES_COUNT][CANDIDATES_COUNT];
void init()
{
    uint16_t i, j;
    size_t offset = 0;
    for (i = NUM_START; i <= NUM_END; i++) {
        uint16_t num = int2bcd(i);
        if (BCD_INVALID_NUM == num) {
            continue;
        }
        numbers[offset] = num;
        offset++;
    }
    for (i = 0; i < CANDIDATES_COUNT; i++) {
        for (j = 0; j < CANDIDATES_COUNT; j++) {
            checkTable[i][j] = check(numbers[i], numbers[j]);
        }
    }
}
static inline uint16_t pickNum(unsigned int *seed, uint16_t max)
{
    uint64_t n = rand_r(seed);
    n *= max;
    n /= RAND_MAX;
    return (uint16_t)(n % max);
}
static inline uint8_t checkById(uint16_t ans, uint16_t guess)
{
    return checkTable[ans][guess];
}
uint8_t guess(unsigned int *seed){
	uint16_t ans = pickNum(seed, CANDIDATES_COUNT), candidates[CANDIDATES_COUNT], cl = CANDIDATES_COUNT,
		times = 0, ci, g, i, res;
	while (times < GUESS_CHANCES) {
		if (0 == times) {
            g = pickNum(seed, CANDIDATES_COUNT);
			res = checkById(ans, g);
			if (res == 0x40) {
				return times + 1;
			}
			times++;
			for (i = 0, ci = 0; i < CANDIDATES_COUNT; i++) {
				if (res == checkById(g, i)) {
					candidates[ci] = i;
					ci++;
				}
			}
		} else {
			g = candidates[pickNum(seed, cl)];
			res = checkById(ans, g);
			if (res == 0x40) {
				return times + 1;
			}
			times++;
			for (i = 0, ci = 0; i < cl; i++) {
				if (res == checkById(g, candidates[i])) {
					candidates[ci] = candidates[i];
					ci++;
				}
			}
		}
		cl = ci;
		if (cl == 0) {
			return 0;
		}
	}
	return times;
}