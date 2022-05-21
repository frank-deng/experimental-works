#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <malloc.h>
#include <sys/types.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>

#include <pthread.h>
#include <sys/sysinfo.h>
#define min(x, y) ((x) < (y) ? (x) : (y))
#define max(x, y) ((x) > (y) ? (x) : (y))

#define GUESS_CHANCES 16
#define CANDIDATES_COUNT 10000
#define PREBUFFER_CHECK

static uint16_t numbers[CANDIDATES_COUNT];
#ifdef PREBUFFER_CHECK
static uint8_t checkTable[CANDIDATES_COUNT][CANDIDATES_COUNT];
#endif

static inline uint16_t int2bcd(uint32_t n)
{
	uint16_t result = 0;
	result |= (n % 10);
	result |= ((n / 10) % 10) << 4;
	result |= ((n / 100) % 10) << 8;
	result |= ((n / 1000) % 10) << 12;
	return result;
}
uint8_t check(uint16_t ans, uint16_t guess)
{
	uint8_t offset, result = 0;
    uint8_t existAns[10] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
    uint8_t existGuess[10] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
	for (offset = 0; offset < 16; offset += 4) {
		uint8_t valAns = (ans >> offset);
		uint8_t valGuess = (guess >> offset);
		valAns &= 0x0f;
		valGuess &= 0x0f;
		if (valAns == valGuess) {
			result += 0x10;
            continue;
		}
        existAns[valAns]++;
        existGuess[valGuess]++;
	}
    for (uint8_t i = 0; i < 10; i++) {
        result += min(existAns[i], existGuess[i]);
    }
	return result;
}
void init()
{
	uint16_t i, x, y;
	for (i = 0; i < CANDIDATES_COUNT; i++) {
        numbers[i] = int2bcd(i);
	}
#ifdef PREBUFFER_CHECK
	for (y = 0; y < CANDIDATES_COUNT; y++) {
		for (x = 0; x < CANDIDATES_COUNT; x++) {
			checkTable[y][x] = check(numbers[y], numbers[x]);
		}
	}
#endif
}
static inline uint8_t checkById(uint16_t ans, uint16_t guess)
{
#ifdef PREBUFFER_CHECK
	return checkTable[ans][guess];
#else
	return check(numbers[ans], numbers[guess]);
#endif
}
uint8_t guess(){
	uint32_t ans = rand() % CANDIDATES_COUNT, candidates[CANDIDATES_COUNT], cl = CANDIDATES_COUNT,
		ci, g, i, res;
	uint8_t times = 0;
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

int read_file(char *filename, uint64_t *stat){
	FILE *fp; int i;
	char num[100] = "\0";

	for (i = 0; i < GUESS_CHANCES + 1; i++) {
		stat[i] = 0;
	}
	fp = fopen(filename, "r");
	if (NULL == fp) {
		return 0;
	}
	for (i = 0; i < GUESS_CHANCES + 1; i++) {
		char *buf = fgets(num, 100, fp);
		if (buf == NULL) {
			continue;
		}
		stat[i] = strtoull(buf, NULL, 0);
	}
	fclose(fp);
	return 1;
}
int write_file(char *filename, uint64_t *stat){
	FILE *fp; int i;

	fp = fopen(filename, "w");
	if (NULL == fp) {
		return 0;
	}
	for (i = 0; i < GUESS_CHANCES + 1; i++) {
		fprintf(fp, "%llu\n", stat[i]);
	}
	fclose(fp);
	return 1;
}
int needWriteFile(uint64_t *lastTime, uint64_t interval)
{
    struct timeval curTimeVal;
    gettimeofday(&curTimeVal, NULL);
    uint64_t curTime = curTimeVal.tv_sec;
    curTime *= 1000000;
    curTime += curTimeVal.tv_usec;
    if (*lastTime == 0) {
        *lastTime = curTime;
        return 0;
    }
    if ((curTime - (*lastTime)) < max(interval * 1000, 1000)) {
        return 0;
    }
    *lastTime = curTime;
    return 1;
}

static int running = 1;
void action_quit(int sig){
	running = 0;
}
int main(int argc, char *argv[]) {
	int i;
    char *filename;
    uint64_t mstat[GUESS_CHANCES + 1] = { 0 };
    uint64_t interval = 500;

	if (argc < 2) {
		fprintf(stderr, "Usage: %s FILENAME [interval_ms]\n", argv[0]);
		return 1;
	}
	
	filename = argv[1];
    if (argc > 2) {
		interval = strtoul(argv[2], NULL, 0);
    }
	init();
	read_file(filename, mstat);
	signal(SIGINT, action_quit);
	signal(SIGQUIT, action_quit);
	srand(time(NULL));
    uint64_t lastTime = 0;
	while (running){
		mstat[guess()]++;
		if (needWriteFile(&lastTime, interval) != 0) {
			write_file(filename, mstat);
        }
	}
	write_file(filename, mstat);
	signal(SIGINT, SIG_DFL);
	signal(SIGQUIT, SIG_DFL);
	return 0;
}
