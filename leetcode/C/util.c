#include "util.h"

typedef enum {
    DIR_LEFT,
    DIR_RIGHT,
} dir_t;
typedef struct {
    struct TreeNode *node;
    dir_t dir;
} iter_t;
typedef struct {
    size_t head;
    size_t tail;
    size_t size;
    iter_t data[0];
} queue_t;
static queue_t *createQueue(size_t size)
{
    queue_t *queue = (queue_t*)malloc(sizeof(queue_t) + sizeof(iter_t) * size);
    if (queue == NULL) {
        return NULL;
    }
    queue->head = queue->tail = 0;
    queue->size = size;
    return queue;
}
static void freeQueue(queue_t *queue)
{
    if (NULL == queue) {
        return;
    }
    free(queue);
}
static int queueIn(queue_t *queue, iter_t *iter)
{
    if (queue->tail - queue->head >= queue->size) {
        return -1;
    }
    iter_t *data = queue->data;
    data[queue->tail % queue->size] = *iter;
    queue->tail++;
    return 0;
}
static int queueOut(queue_t *queue, iter_t *iter)
{
    if (queue->tail <= queue->head) {
        return -1;
    }
    iter_t *data = queue->data;
    *iter = data[queue->head % queue->size];
    queue->head++;
    return 0;
}
struct TreeNode* genTree(int *data, size_t length)
{
    if (length <= 0) {
        return NULL;
    }

    queue_t *queue = createQueue(length);
    if (NULL == queue) {
        return NULL;
    }

    struct TreeNode* result = (struct TreeNode*)calloc(
        sizeof(struct TreeNode), 1);
    result->val = data[0];

    iter_t iter;
    iter.node = result;
    iter.dir = DIR_LEFT;
    queueIn(queue, &iter);
    iter.dir = DIR_RIGHT;
    queueIn(queue, &iter);

    int i;
    for (i = 1; i < length; i++) {
        if (queueOut(queue, &iter)) {
            break;
        }
        if (data[i] < 0) {
            continue;
        }

        struct TreeNode* node = (struct TreeNode*)calloc(
            sizeof(struct TreeNode), 1);
        node->val = data[i];
        if (DIR_LEFT == iter.dir) {
            iter.node->left = node;
        } else if (DIR_RIGHT == iter.dir) {
            iter.node->right = node;
        }

        iter.node = node;
        iter.dir = DIR_LEFT;
        queueIn(queue, &iter);
        iter.dir = DIR_RIGHT;
        queueIn(queue, &iter);
    }
    freeQueue(queue);
    return result;
}
void freeTree(struct TreeNode* tree)
{
    if (NULL == tree) {
        return;
    }
    freeTree(tree->left);
    freeTree(tree->right);
    free(tree);
}

