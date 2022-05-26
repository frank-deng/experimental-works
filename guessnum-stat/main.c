#include <stdio.h>
#include "worker.h"

int readFile(char *filename, uint64_t *stat)
{
	int i;
	char num[100] = "\0";
	FILE *fp = fopen(filename, "r");
	if (NULL == fp) {
		return 0;
	}
	for (i = 0; i < GUESS_CHANCES + 1; i++) {
		char *buf = fgets(num, 100, fp);
		if (NULL == buf) {
			stat[i] = 0;
		} else {
			stat[i] = strtoull(buf, NULL, 0);
		}
	}
	fclose(fp);
	return 1;
}
int writeFile(char *filename, uint64_t *stat)
{
	int i;
	FILE *fp = fopen(filename, "w");
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

bool running = true;
int main(int argc, char *argv[])
{
    if (argc < 2) {
		fprintf(stderr, "Usage: %s FILENAME [interval_ms]\n", argv[0]);
		return 1;
	}
    char *filename = argv[1];
    uint32_t interval = 500;
    if (argc > 2) {
		interval = strtoul(argv[2], NULL, 0);
    }
    worker_t worker;
    if (workerInit(&worker, 0) != 0) {
        fprintf(stderr, "Initialization failed.");
        return 1;
    }
	pthread_mutex_lock(worker.reportMutex);
    readFile(filename, worker.stat);
	pthread_mutex_unlock(worker.reportMutex);

	while (running) {
        usleep(interval * 1000);
        workerStartReport(&worker);
        writeFile(filename, worker.stat);
	}

    workerExit(&worker);
    writeFile(filename, worker.stat);
    return 0;
}
