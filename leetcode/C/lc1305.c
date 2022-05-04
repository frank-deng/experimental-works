#include "test.h"

typedef struct TreeNode TreeNode_t;
typedef enum {
    ITER_LEFT,
    ITER_MIDDLE,
    ITER_RIGHT
} TreeIterAction_t;
typedef struct TreeIterStack_s{
    struct TreeIterStack_s *prev;
    TreeNode_t *leaf;
    TreeIterAction_t action;
} TreeIterStack_t;
typedef struct {
    TreeNode_t* tree;
    TreeIterStack_t *stack;
} TreeIter_t;

bool treeIterStackPush(TreeIter_t *iter, TreeNode_t *leaf)
{
    TreeIterStack_t *item = (TreeIterStack_t*)malloc(sizeof(TreeIterStack_t));
    if (NULL == item) {
        return false;
    }
    item->prev = iter->stack;
    iter->stack = item;
    item->leaf = leaf;
    item->action = ITER_LEFT;
    return true;
}
bool treeIterStackPop(TreeIter_t *iter)
{
    if (NULL == iter->stack) {
        return false;
    }
    TreeIterStack_t *item = iter->stack;
    iter->stack = item->prev;
    free(item);
    return true;
}
bool treeIterInit(TreeIter_t *iter, TreeNode_t* tree)
{
    iter->tree = tree;
    iter->stack = NULL;
    if (NULL == tree) {
        return true;
    }
    return treeIterStackPush(iter, tree);
}
void treeIterClose(TreeIter_t *iter)
{
    while (treeIterStackPop(iter)) {
    }
    iter->tree = NULL;
}
bool treeIterProcess(TreeIter_t *iter, int *value)
{
    TreeIterStack_t *stackTop = iter->stack;
    if (NULL == stackTop) {
        return false;
    }
    if (ITER_LEFT == stackTop->action) {
        while (NULL != stackTop->leaf->left) {
            treeIterStackPush(iter, stackTop->leaf->left);
            stackTop = iter->stack;
        }
    }
    stackTop = iter->stack;
    stackTop->action = ITER_RIGHT;
    TreeNode_t *leaf = stackTop->leaf;
    *value = leaf->val;
    if (NULL != leaf->right) {
        treeIterStackPush(iter, leaf->right);
        return true;
    }

    while (NULL != stackTop && stackTop->action == ITER_RIGHT) {
        treeIterStackPop(iter);
        stackTop = iter->stack;
    }
    if (NULL == stackTop) {
        return true;
    }
    stackTop->action = ITER_MIDDLE;
    return true;
}
int* getAllElements(struct TreeNode* tree0, struct TreeNode* tree1, int* returnSize)
{
    if (NULL == tree0 && NULL == tree1) {
        *returnSize = 0;
        return NULL;
    }
    TreeIter_t iter0, iter1;
    treeIterInit(&iter0, tree0);
    treeIterInit(&iter1, tree1);
    int count = 0, value, value0, value1;
    while (treeIterProcess(&iter0, &value0)) {
        count++;
    }
    while (treeIterProcess(&iter1, &value1)) {
        count++;
    }
    treeIterClose(&iter0);
    treeIterClose(&iter1);

    int *result = (int*)malloc(sizeof(int) * count);
    int i = 0;
    treeIterInit(&iter0, tree0);
    treeIterInit(&iter1, tree1);
    bool hasData0 = treeIterProcess(&iter0, &value0);
    bool hasData1 = treeIterProcess(&iter1, &value1);
    while (hasData0 && hasData1) {
        if (value0 < value1) {
            result[i] = value0;
            hasData0 = treeIterProcess(&iter0, &value0);
        } else {
            result[i] = value1;
            hasData1 = treeIterProcess(&iter1, &value1);
        }
        i++;
    }
    if (hasData0) {
        do {
            result[i] = value0;
            i++;
        } while (treeIterProcess(&iter0, &value0));
    } else if (hasData1) {
        do {
            result[i] = value1;
            i++;
        } while (treeIterProcess(&iter1, &value1));
    }

    treeIterClose(&iter0);
    treeIterClose(&iter1);
    *returnSize = count;
    return result;
}
