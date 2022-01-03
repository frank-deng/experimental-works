#include <string.h>
#include <malloc.h>
#include "btree.h"

bool btreeInit(btree_t *btree, size_t dataSize)
{
    btree->dataSize = dataSize;
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
    btree_leaf_t* leafNew = (btree_leaf_t*)malloc(
        sizeof(btree_leaf_t) + btree->dataSize);
    if (leafNew == NULL) {
        return NULL;
    }
    leafNew->left = NULL;
    leafNew->right = NULL;
    leafNew->parent = leaf;
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
    btree->dataSize = 0;
    if (btree->root == NULL) {
        return;
    }
    btreeFreeLeaf(btree->root);
    btree->root = NULL;
}

bool btreeLayerWalkerInit(queue_t *queue, btree_t *btree)
{
    if (queue == NULL || btree == NULL) {
        return false;
    }
    queueInit(queue, sizeof(btree_leaf_t*), 0);
    if (btree->root != NULL) {
        queuePush(queue, &btree->root);
    }
    return true;
}
bool btreeLayerWalkerIter(queue_t *queue, btree_leaf_t **leafOut)
{
    btree_leaf_t *leaf = NULL;
    if (!queuePop(queue, &leaf)) {
        return false;
    }
    if (leaf != NULL) {
        queuePush(queue, &(leaf->left));
        queuePush(queue, &(leaf->right));
    }
    if (leafOut != NULL) {
        *leafOut = leaf;
    }
    return true;
}

typedef struct {
    btree_leaf_t *parent;
    btree_pos_t pos;
} btree_creator_queue_item_t;
bool btreeCreatorInit(btree_creator_t *creator, btree_t *btree)
{
    if (creator == NULL || btree == NULL) {
        return false;
    }
    creator->btree = btree;
    queueInit(&creator->queue, sizeof(btree_creator_queue_item_t), 0);
    btree_creator_queue_item_t rootItem = {
        .parent = NULL,
        .pos = BTREE_LEFT
    };
    queuePush(&creator->queue, &rootItem);
    return true;
}
void btreeCreatorFree(btree_creator_t *creator)
{
    creator->btree = NULL;
    queueFree(&creator->queue);
}
bool btreeCreatorIter(btree_creator_t *creator, bool pass,
    btree_leaf_t **leafOut)
{
    btree_creator_queue_item_t item;
    if (!queuePop(&creator->queue, &item)) {
        return false;
    }
    if (pass) {
        if (leafOut != NULL) {
            *leafOut = NULL;
        }
        return queueHasData(&creator->queue);
    }
    btree_t *btree = creator->btree;
    btree_leaf_t *leaf = btreeInsertLeaf(btree, item.parent, item.pos);
    if (leaf == NULL) {
        return queueHasData(&creator->queue);
    }
    if (leafOut != NULL) {
        *leafOut = leaf;
    }
    item.parent = leaf;
    item.pos = BTREE_LEFT;
    queuePush(&creator->queue, &item);
    item.pos = BTREE_RIGHT;
    queuePush(&creator->queue, &item);
    return true;
}

