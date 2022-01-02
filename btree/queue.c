#include <string.h>
#include "queue.h"

static queue_block_t *queueCreateBlock(queue_t *queue);
bool queueInit(queue_t *queue, size_t itemSize, size_t blockSize)
{
    if (itemSize <= 0 || blockSize <= 0) {
        return false;
    }
    queue->itemSize = itemSize;
    queue->blockSize = blockSize;
    queue_block_t *block = queueCreateBlock(queue);
    queue->start = block;
    queue->end = block;
    return true;
}
void queueFree(queue_t *queue)
{
    if (queue == NULL) {
        return;
    }
    queue_block_t *curr = queue->start;
    queue_block_t *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        free(curr);
        curr = next;
    }
    queue->start = NULL;
    queue->end = NULL;
    queue->itemSize = 0;
    queue->blockSize = 0;
}
static queue_block_t *queueCreateBlock(queue_t *queue)
{
    queue_block_t *newBlock = (queue_block_t*)malloc(
        sizeof(queue_block_t) + queue->blockSize * queue->itemSize);
    if (newBlock == NULL) {
        return NULL;
    }
    newBlock->next = NULL;
    newBlock->start = 0;
    newBlock->end = 0;
    return newBlock;
}
bool queueIn(queue_t *queue, void *data)
{
    if (queue == NULL) {
        return false;
    }
    queue_block_t *block = queue->end;
    if (block == NULL) {
        return false;
    }
    size_t size = queue->blockSize;

    // Need create a block, current block is full
    if (block->end > block->start &&
        (block->end % size) == (block->start % size)) {
        queue_block_t *newBlock = queueCreateBlock(queue);
        if (newBlock == NULL) {
            return false;
        }
        queue->end = newBlock;
        if (block == NULL) {
            queue->start = newBlock;
        } else {
            block->next = newBlock;
        }
        block = newBlock;
    }

    // Insert data into queue
    size_t offset = (block->end % queue->blockSize) * queue->itemSize;
    void *target = (void*)((char*)(queue->data) + offset);
    memcpy(target, data, queue->itemSize);
    (block->end)++;
    return true;
}
bool queueOut(queue_t *queue, void *data)
{
    if (queue == NULL) {
        return false;
    }
    queue_block_t *block = queue->start;
    if (block == NULL) {
        return false;
    }
    if (block->start >= block->end) {
        return false;
    }

    // Export data from queue
    size_t offset = (block->start % size) * queue->itemSize;
    void *target = (void*)((char*)(queue->data) + offset);
    memcpy(data, target, queue->itemSize);
    (block->start)++;

    // Need to free current block
    if (block->start >= block->end && queue->start != queue->end) {
        queue->start = block->next;
        free(block);
    }

    return true;
}

