#ifndef worker_h
#define worker_h

#include <stdbool.h>
#include <stdint.h>
#include <pthread.h>
#include "guessnum.h"

struct worker_s;
struct thread_data_s {
    pthread_t tid;
    uint32_t randomSeed;
    bool running;
    bool report;
    struct worker_s *shared;
};
struct worker_s{
    bool running;
    uint8_t threadCount;
    uint8_t reportCount;
    pthread_mutex_t reportMutex;
	uint64_t stat[GUESS_CHANCES + 1];
    struct thread_data_s *threadData;
};

typedef struct thread_data_s thread_data_t;
typedef struct worker_s worker_t;

#ifdef __cplusplus
extern "C" {
#endif

int workerInit(worker_t *worker, uint8_t threadCount);
void workerExit(worker_t *worker);
void workerStartReport(worker_t *worker);

#ifdef __cplusplus
}
#endif

#endif