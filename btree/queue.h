#ifndef QUEUE_H
#define QUEUE_H

#include <stdlib.h>
#include <stdbool.h>

typedef struct queue_block_s {
    struct queue_block_s *next;
    size_t start;
    size_t end;
    char data[0];
} queue_block_t;

typedef struct {
    size_t itemSize;
    size_t blockSize;
    queue_block_t *start;
    queue_block_t *end;
} queue_t;

#ifdef __cplusplus
extern "C" {
#endif

bool queueInit(queue_t *queue, size_t itemSize, size_t blockSize);
void queueFree(queue_t *queue);
bool queuePush(queue_t *queue, void *data);
bool queuePop(queue_t *queue, void *data);

#ifdef __cplusplus
}
#endif

#endif

