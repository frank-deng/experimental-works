#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <malloc.h>
#include <sys/sysinfo.h>
#include <unistd.h>
#include "worker.h"

void* workerMain(void *data){
	thread_data_t *threadData = (thread_data_t*)data;
	unsigned int randomSeed = threadData->randomSeed;
	uint64_t stat[GUESS_CHANCES + 1] = { 0 };
	uint8_t i;
	while (threadData->running) {
		stat[guess(&randomSeed)]++;
		if (!threadData->report) {
			continue;
		}
		pthread_mutex_lock(&threadData->shared->reportMutex);
		for (i = 0; i < GUESS_CHANCES + 1; i++) {
			threadData->shared->stat[i] += stat[i];
		}
		(threadData->shared->reportCount)++;
		pthread_mutex_unlock(&threadData->shared->reportMutex);
		threadData->report = false;
		memset(stat, 0, sizeof(stat));
	}
	pthread_mutex_lock(&threadData->shared->reportMutex);
	for (i = 0; i < GUESS_CHANCES + 1; i++) {
		threadData->shared->stat[i] += stat[i];
	}
	pthread_mutex_unlock(&threadData->shared->reportMutex);
	return NULL;
}
int workerInit(worker_t *worker, uint8_t threadCount)
{
	init();
	if (threadCount <= 0) {
		threadCount = get_nprocs();
	}
	worker->threadData = calloc(threadCount, sizeof(thread_data_t));
	if (NULL == worker->threadData) {
		return 1;
	}
	worker->threadCount = threadCount;
	worker->reportCount = 0;
	memset(worker->stat, 0, sizeof(worker->stat));
	pthread_mutex_init(&worker->reportMutex, NULL);
	
	srand(time(NULL));
	uint8_t i;
	for (i = 0; i < threadCount; i++) {
		worker->threadData[i].running = true;
		worker->threadData[i].shared = worker;
		worker->threadData[i].randomSeed = (unsigned int)rand();
		pthread_create(&(worker->threadData[i].tid), NULL, workerMain, &(worker->threadData[i]));
	}
	return 0;
}
void workerExit(worker_t *worker)
{
	uint8_t i;
	for (i = 0; i < worker->threadCount; i++) {
		worker->threadData[i].running = false;
	}
	for (i = 0; i < worker->threadCount; i++) {
		pthread_join(worker->threadData[i].tid, NULL);
	}
	pthread_mutex_destroy(&worker->reportMutex);
	free(worker->threadData);
	worker->threadData = NULL;
}
void workerStartReport(worker_t *worker)
{
	uint8_t i;
	for (i = 0; i < worker->threadCount; i++) {
		worker->threadData[i].report = true;
	}
	bool waiting = true;
	while (waiting) {
		usleep(1000);
		pthread_mutex_lock(&worker->reportMutex);
		if (worker->reportCount == worker->threadCount) {
			worker->reportCount = 0;
			waiting = false;
		}
		pthread_mutex_unlock(&worker->reportMutex);
	}
}
