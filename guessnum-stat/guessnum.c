#include "guessnum.h"

#define min(x, y) ((x) < (y) ? (x) : (y))
#define max(x, y) ((x) > (y) ? (x) : (y))

uint8_t check(uint16_t ans, uint16_t guess)
{
	uint8_t offset, result = 0;
    uint8_t existAns[10] = { 0 };
    uint8_t existGuess[10] = { 0 };
	for (offset = 0; offset < 16; offset += 4) {
		uint8_t valAns = (ans >> offset) & 0xf;
		uint8_t valGuess = (guess >> offset) & 0xf;
		if (valAns == valGuess) {
			result += 0x10;
            continue;
		}
        existAns[valAns]++;
        existGuess[valGuess]++;
	}
	uint8_t i;
    for (i = 0; i < 10; i++) {
        result += min(existAns[i], existGuess[i]);
    }
    return result;
}

uint16_t int2bcd(uint16_t n, bool allowDupDigit)
{
	uint16_t result = 0, map = 0, offset = 0;
    while (n && offset <= 12) {
        uint8_t digit = (n % 10);
        if (!allowDupDigit && (map & (1 << digit)) != 0) {
            return BCD_INVALID_NUM;
        }
        map |= (1 << digit);
        result |= digit << offset;
        n /= 10;
        offset += 4;
    }
	return result;
}
