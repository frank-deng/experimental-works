#include <malloc.h>
#include <string.h>
#include "stack.h"

#define INITIAL_SIZE_DEFAULT 128

bool stackInit(_stack_t *stack, size_t itemSize, size_t initialSize)
{
    if (itemSize <= 0) {
        return false;
    }
    if (initialSize <= 0) {
        initialSize = INITIAL_SIZE_DEFAULT;
    }
    stack->itemSize = itemSize;
    stack->size = 0;
    stack->blockSize = initialSize;
    stack->data = malloc(stack->itemSize * stack->blockSize);
    return true;
}
void stackFree(_stack_t *stack)
{
    stack->itemSize = 0;
    stack->size = 0;
    stack->blockSize = 0;
    if (stack->data != NULL) {
        free(stack->data);
        stack->data = NULL;
    }
}
bool stackPush(_stack_t *stack, void *data)
{
    if (data == NULL) {
        return false;
    }
    if (stack->size >= stack->blockSize) {
        stack->blockSize += (stack->blockSize >> 1);
        stack->data = realloc(stack->data, stack->itemSize * stack->blockSize);
        if (stack->data == NULL) {
            return false;
        }
    }
    size_t offset = stack->size * stack->itemSize;
    void *target = (void*)((char*)(stack->data) + offset);
    memcpy(target, data, stack->itemSize);
    (stack->size)++;
    return true;
}
bool stackPop(_stack_t *stack, void *data)
{
    if (stack->size <= 0) {
        return false;
    }
    size_t offset = (stack->size - 1) * stack->itemSize;
    void *target = (void*)((char*)(stack->data) + offset);
    if (data != NULL) {
        memcpy(data, target, stack->itemSize);
    }
    (stack->size)--;
    return true;
}

