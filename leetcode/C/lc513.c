#include <malloc.h>
#include "test.h"

typedef struct QueueItemS {
    struct QueueItemS *next;
    unsigned int level;
    struct TreeNode* node;
} QueueItemT;
typedef struct {
    QueueItemT *head, *tail;
} QueueT;
int QueueIn(QueueT *queue, struct TreeNode* node, unsigned int level)
{
    QueueItemT *item = (QueueItemT*)malloc(sizeof(QueueItemT));
    if (item == NULL) {
        return 1;
    }
    item->level = level;
    item->node = node;
    item->next = NULL;
    if (queue->tail != NULL) {
        queue->tail->next = item;
    }
    queue->tail = item;
    if (queue->head == NULL) {
        queue->head = item;
    }
    return 0;
}
int QueueOut(QueueT *queue, struct TreeNode** node, unsigned int *level)
{
    if (queue->head == NULL) {
        return 1;
    }
    *node = queue->head->node;
    *level = queue->head->level;
    QueueItemT *temp = queue->head;
    queue->head = queue->head->next;
    if (queue->head == NULL) {
        queue->tail = NULL;
    }
    free(temp);
    return 0;
}
int findBottomLeftValue(struct TreeNode* root)
{
    QueueT queue = { 0 };
    if (root == NULL) {
        return 0;
    }
    QueueIn(&queue, root, 1);
    struct TreeNode* node = NULL;
    unsigned int levelLast = 0, level = 0;
    int value = 0;
    while (QueueOut(&queue, &node, &level) == 0) {
        if (level > levelLast) {
            levelLast = level;
            value = node->val;
        }
        if (node->left != NULL) {
            QueueIn(&queue, node->left, level + 1);
        }
        if (node->right != NULL) {
            QueueIn(&queue, node->right, level + 1);
        }
    }
    return value;
}
