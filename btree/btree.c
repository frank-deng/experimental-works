#include <malloc.h>
#include "btree.h"
#include "queue.h"

bool btreeInit(btree_t *btree, size_t dataSize)
{
    btree->leafSize = sizeof(btree_leaf_t) + dataSize;
    btree->root = NULL;
    if (dataSize <= 0) {
        return false;
    }
    return true;
}
btree_leaf_t* btreeInsertLeaf(btree_t *btree, btree_leaf_t *leaf,
    btree_pos_t pos)
{
    if (leaf != NULL) {
        if ((pos == BTREE_LEFT && leaf->left != NULL) ||
            (pos == BTREE_RIGHT && leaf->right != NULL)) {
            return NULL;
        }
    } else if (btree->root != NULL) {
        return NULL;
    }
    btree_leaf_t* leafNew = (btree_leaf_t*)malloc(btree->leafSize);
    if (leafNew == NULL) {
        return NULL;
    }
    leafNew->left = NULL;
    leafNew->right = NULL;
    if (leaf == NULL) {
        btree->root = leafNew;
    } else if (pos == BTREE_LEFT) {
        leaf->left = leafNew;
    } else if (pos == BTREE_RIGHT) {
        leaf->right = leafNew;
    } else {
        free(leafNew);
        return NULL;
    }
    return leafNew;
}
static void btreeFreeLeaf(btree_leaf_t *leaf)
{
    if (leaf->left != NULL) {
        btreeFreeLeaf(leaf->left);
        leaf->left = NULL;
    }
    if (leaf->right != NULL) {
        btreeFreeLeaf(leaf->right);
        leaf->right = NULL;
    }
    free(leaf);
}
void btreeFree(btree_t *btree)
{
    if (btree == NULL) {
        return;
    }
    btree->leafSize = 0;
    if (btree->root == NULL) {
        return;
    }
    btreeFreeLeaf(btree->root);
    btree->root = NULL;
}
void btreeWalkByLayer(btree_t *btree, btree_walk_callback_t callback,
    void *data)
{
    if (btree == NULL) {
        return;
    }
    if (btree->root == NULL) {
        return;
    }
    queue_t queue;
    queueInit(&queue, sizeof(btree_leaf_t*), 0);
    btree_leaf_t* item = btree->root;
    do {
        if (callback != NULL) {
            (*callback)(item, data);
        }
        if (item == NULL) {
            continue;
        }
        if (item->left == NULL && item->right == NULL) {
            continue;
        }
        queuePush(&queue, &(item->left));
        queuePush(&queue, &(item->right));
    } while (queuePop(&queue, &item));
    queueFree(&queue);
}

