#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include <unistd.h>
#include <signal.h>
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
bool needWriteFile(uint64_t *lastTime, uint64_t interval)
{
    struct timeval curTimeVal;
    gettimeofday(&curTimeVal, NULL);
    uint64_t curTime = curTimeVal.tv_sec;
    curTime *= 1000000;
    curTime += curTimeVal.tv_usec;
    if (*lastTime == 0) {
        *lastTime = curTime;
        return false;
    }
    if ((curTime - (*lastTime)) < max(interval * 1000, 1000)) {
        return false;
    }
    *lastTime = curTime;
    return true;
}

bool running = true;
void action_quit(int sig)
{
	running = false;
}
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

	signal(SIGINT, action_quit);
	signal(SIGQUIT, action_quit);
	pthread_mutex_lock(&(worker.reportMutex));
    readFile(filename, worker.stat);
	pthread_mutex_unlock(&(worker.reportMutex));
    uint64_t lastTime = 0;
	while (running) {
        usleep(1000);
        if (!needWriteFile(&lastTime, interval)) {
            continue;
        }
        workerStartReport(&worker);
        pthread_mutex_lock(&(worker.reportMutex));
        writeFile(filename, worker.stat);
        pthread_mutex_unlock(&(worker.reportMutex));
	}
    workerExit(&worker);
    writeFile(filename, worker.stat);
	signal(SIGINT, SIG_DFL);
	signal(SIGQUIT, SIG_DFL);
    return 0;
}
