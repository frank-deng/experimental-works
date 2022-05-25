#include "worker.h"
#include "guessnum.h"

static size_t numbersCount = 0
static uint16_t *numbers = NULL;
static uint8_t *checkTable = NULL;

bool init(bool mastermind)
{
    uint16_t i, j;
    numbersCount = (mastermind ? CANDIDATES_COUNT_MASTERMIND : CANDIDATES_COUNT);

    numbers = (uint16_t*)malloc(sizeof(uint16_t) * numbersCount);
    if (numbers == NULL) {
        return false;
    }
    checkTable = (uint8_t*)malloc(sizeof(uint8_t) * numbersCount * numbersCount);
    if (checkTable == NULL) {
        return false;
    }

    size_t offset = 0;
    for (i = 0; i <= 9999; i++) {
        uint16_t num = int2bcd(i, mastermind);
        if (BCD_INVALID_NUM == num) {
            continue;
        }
        numbers[offset] = num;
        offset++;
    }
    offset = 0;
    for (i = 0; i < numbersCount; i++) {
        for (j = 0; j < numbersCount; j++) {
            checkTable[offset] = check(numbers[i], numbers[j]);
            offset++;
        }
    }
    return true;
}
bool quit()
{
    free(numbers);
    free(checkTable);
}
static inline uint8_t checkById(uint16_t ans, uint16_t guess)
{
    return checkTable[ans * numbersCount + guess];
}
uint8_t guess(){
	uint16_t ans = rand() % CANDIDATES_COUNT, candidates[CANDIDATES_COUNT], cl = CANDIDATES_COUNT,
		times = 0, ci, g, i, res;
	while (times < GUESS_CHANCES) {
		if (0 == times) {
			g = rand() % CANDIDATES_COUNT;
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
			g = candidates[rand() % cl];
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
