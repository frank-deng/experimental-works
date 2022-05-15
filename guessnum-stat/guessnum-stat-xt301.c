#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <malloc.h>
#include <sys/types.h>
#include <signal.h>
#include <unistd.h>

#include <sys/sysinfo.h>
#define GUESS_CHANCES 12
#define CANDIDATES_COUNT 5040

uint32_t numbers[CANDIDATES_COUNT];
uint8_t check_table[CANDIDATES_COUNT][CANDIDATES_COUNT];
typedef union {
	uint32_t n;
	uint8_t c[4];
} cv_t;
int isvalidnum(uint32_t n) {
	cv_t cv; int i, j;
	cv.n = n;
	for (i = 0; i < 3; i++) {
		for (j = i+1; j < 4; j++) {
			if (cv.c[i] == cv.c[j]) {
				return 0;
			}
		}
	}
	return 1;
}
int32_t int2bcd(int32_t n) {
	cv_t cv;
	cv.c[0] = n % 10;
	cv.c[1] = (n / 10) % 10;
	cv.c[2] = (n / 100) % 10;
	cv.c[3] = (n / 1000) % 10;
	return cv.n;
}
uint32_t check(uint32_t ans, uint32_t guess){
	cv_t cv_a, cv_g;
	uint32_t i, j, result = 0;
	cv_a.n = ans; cv_g.n = guess;
	for (i = 0; i < 4; i++) {
		if (cv_a.c[i] == cv_g.c[i]) {
			result += 0x10;
		} else {
			for (j = 0; j < 4; j++) {
				if ((i != j) && (cv_a.c[i] == cv_g.c[j])) {
					result += 1;
				}
			}
		}
	}
	return result;
}
void init(){
	int cnt = 0;
	uint32_t i, n;
	uint16_t x, y;
	for (i = 123; i <= 9877; i++) {
		n = int2bcd(i);
		if (isvalidnum(n)) {
			numbers[cnt] = n;
			cnt++;
		}
	}
	for (y = 0; y < CANDIDATES_COUNT; y++) {
		for (x = 0; x < CANDIDATES_COUNT; x++) {
			check_table[y][x] = check(numbers[y], numbers[x]);
		}
	}
}

uint32_t guess(){
	uint32_t ans = rand() % CANDIDATES_COUNT, candidates[CANDIDATES_COUNT], cl = CANDIDATES_COUNT,
		times = 0, ci, g, i, res;
	while (times < GUESS_CHANCES) {
		if (0 == times) {
			g = rand() % CANDIDATES_COUNT;
			res = check_table[ans][g];
			if (res == 0x40) {
				return times + 1;
			}
			times++;
			for (i = 0, ci = 0; i < CANDIDATES_COUNT; i++) {
				if (res == check_table[g][i]) {
					candidates[ci] = i;
					ci++;
				}
			}
		} else {
			g = candidates[rand() % cl];
			res = check_table[ans][g];
			if (res == 0x40) {
				return times + 1;
			}
			times++;
			for (i = 0, ci = 0; i < cl; i++) {
				if (res == check_table[g][candidates[i]]) {
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

typedef unsigned long long stat_t;
static int running = 1;
static int writeFile = 0;
static unsigned int writeFileCounter = 1000;
static unsigned int writeFileCounterInit = 1000;
static stat_t mstat[GUESS_CHANCES + 1];

void action_quit(int sig){
	running = 0;
}
void action_write(int sig){
	writeFile = 1;
}
int read_file(char *filename, stat_t *stat){
	FILE *fp; int i;
	char num[100] = "\0";

	fp = fopen(filename, "r");
	if (NULL == fp) {
		return 0;
	}
	for (i = 0; i < GUESS_CHANCES + 1; i++) {
		stat[i] = strtoull(fgets(num, 100, fp), NULL, 0);
	}
	fclose(fp);
	return 1;
}
int write_file(char *filename, stat_t *stat){
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
int main(int argc, char *argv[]) {
	int i;
    char *filename;
	if (argc < 2) {
		fprintf(stderr, "Usage: %s FILENAME [rounds]\n", argv[0]);
		return 1;
	}
	
	filename = argv[1];
    if (argc > 2) {
		writeFileCounter = writeFileCounterInit = strtoul(argv[2], NULL, 0);
    }
	init();
	read_file(filename, mstat);
	signal(SIGINT, action_quit);
	signal(SIGQUIT, action_quit);
	srand(time(NULL));
	while (running){
		mstat[guess()]++;
		if (writeFileCounter <= 0) {
			writeFileCounter = writeFileCounterInit;
			write_file(filename, mstat);
		} else {
			writeFileCounter--;
		}
	}
	write_file(filename, mstat);
	signal(SIGINT, SIG_DFL);
	signal(SIGQUIT, SIG_DFL);
	return 0;
}

