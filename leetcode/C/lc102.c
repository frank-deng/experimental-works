#include <malloc.h>
#include "test.h"

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */

/**
 * Return an array of arrays of size *returnSize.
 * The sizes of the arrays are returned as *returnColumnSizes array.
 * Note: Both returned array and *columnSizes array must be malloced, assume caller calls free().
 */
typedef struct queueItemS {
    struct queueItemS *next;
    struct TreeNode *node;
    uint16_t layer;
} queueItemT;
typedef struct {
    queueItemT *head;
    queueItemT *tail;
} queueT;
void queueClear(queueT *queue)
{
    queueItemT *item = queue->head;
    queueItemT *temp = NULL;
    while (item != NULL) {
        temp = item;
        item = item->next;
        free(temp);
    }
}
int queueIn(queueT *queue, struct TreeNode *node, uint16_t layer)
{
    queueItemT *item = (queueItemT*)malloc(sizeof(queueItemT));
    if (NULL == item) {
        return 1;
    }
    item->next = NULL;
    item->node = node;
    item->layer = layer;
    if (queue->head == NULL) {
        queue->head = item;
    }
    if (queue->tail == NULL) {
        queue->tail = item;
    } else {
        queue->tail->next = item;
        queue->tail = item;
    }
    return 0;
}
int queueOut(queueT *queue, struct TreeNode **node, uint16_t *layer)
{
    if (queue->head == NULL) {
        return 1;
    }
    queueItemT *item = queue->head;
    *node = item->node;
    *layer = item->layer;
    queue->head = queue->head->next;
    if (queue->head == NULL) {
        queue->tail = NULL;
    }
    free(item);
    return 0;
}

typedef struct listItemS {
    struct listItemS *prev;
    struct listItemS *next;
    uint8_t data[0];
} listItemT;
typedef struct {
    listItemT *head;
    listItemT *tail;
    size_t size;
} listT;
void insertListItem(listT *list, listItemT *item)
{
    (list->size)++;
    item->next = NULL;
    item->prev = list->tail;
    if (list->head == NULL) {
        list->head = item;
    }
    if (list->tail != NULL) {
        list->tail->next = item;
    }
    list->tail = item;
}
void clearList(listT *list)
{
    listItemT *item = NULL;
    listItemT *temp = NULL;
    for (item = list->head; item != NULL;) {
        temp = item;
        item = item->next;
        free(temp);
    }
    list->head = list->tail = NULL;
    list->size = 0;
}
listItemT* createRow()
{
    return (listItemT*)calloc(sizeof(listItemT) + sizeof(listT), 1);
}
listItemT* createValue()
{
    return (listItemT*)calloc(sizeof(listItemT) + sizeof(int), 1);
}
int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes){
    if (NULL == root) {
        *returnSize = 0;
        *returnColumnSizes = NULL;
        return NULL;
    }

    queueT queue = { 0 };
    queueIn(&queue, root, 0);
    listT resultListData = { 0 };
    listT *resultList = &resultListData;
    struct TreeNode* node = NULL;
    uint16_t layer = 0, layerLast = 0;
    insertListItem(resultList, createRow());
    while (queueOut(&queue, &node, &layer) == 0) {
        if (node->left != NULL) {
            queueIn(&queue, node->left, layer + 1);
        }
        if (node->right != NULL) {
            queueIn(&queue, node->right, layer + 1);
        }
        if (layer != layerLast) {
            layerLast = layer;
            insertListItem(resultList, createRow());
        }
        listItemT *item = createValue();
        *(int*)(item->data) = node->val;
        insertListItem((listT*)(resultList->tail->data), item);
    }

    *returnSize = resultList->size;
    int *columnSizes = (int*)malloc(sizeof(int) * resultList->size);
    *returnColumnSizes = columnSizes;
    int **result = (int**)malloc(sizeof(int*) * resultList->size);
    listItemT *row = NULL;
    size_t rowIdx = 0;
    for (row = resultList->head; row != NULL; row = row->next) {
        listT* valueList = (listT*)(row->data);
        columnSizes[rowIdx] = valueList->size;
        int* row = (int*)malloc(sizeof(int) * valueList->size);
        result[rowIdx] = row;
        listItemT *valueItem = NULL;
        int valueIdx = 0;
        for (valueItem = valueList->head; valueItem != NULL; valueItem = valueItem->next) {
            row[valueIdx] = *(int*)(valueItem->data);
            valueIdx++;
        }
        clearList(valueList);
        rowIdx++;
    }
    clearList(resultList);
    queueClear(&queue);
    return result;
}
