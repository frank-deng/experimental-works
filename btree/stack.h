#ifndef STACK_H
#define STACK_H

#include <stdlib.h>
#include <stdbool.h>

typedef struct {
    size_t itemSize;
    size_t size;
    size_t blockSize;
    void *data;
} _stack_t;

#ifdef __cplusplus
extern "C" {
#endif

bool stackInit(_stack_t *stack, size_t itemSize, size_t initialSize);
void stackFree(_stack_t *stack);
bool stackPush(_stack_t *stack, void *data);
bool stackPop(_stack_t *stack, void *data);

#ifdef __cplusplus
}
#endif

#endif

