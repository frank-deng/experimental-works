#ifndef BTREE_H
#define BTREE_H

#include <stdbool.h>
#include "queue.h"

typedef enum {
    BTREE_LEFT = 0,
    BTREE_RIGHT = 1,
} btree_pos_t;

typedef struct btree_leaf_s {
    struct btree_leaf_s *left;
    struct btree_leaf_s *right;
    struct btree_leaf_s *parent;
    char data[0];
} btree_leaf_t;

typedef struct {
    size_t dataSize;
    btree_leaf_t *root;
} btree_t;

typedef struct {
    btree_t *btree;
    queue_t queue;
} btree_creator_t;

#ifdef __cplusplus
extern "C" {
#endif

bool btreeInit(btree_t *btree, size_t dataSize);
void btreeFree(btree_t *btree);
btree_leaf_t* btreeInsertLeaf(btree_t *btree, btree_leaf_t *leaf,
    btree_pos_t pos);

bool btreeLayerWalkerInit(queue_t *queue, btree_t *btree);
#define btreeLayerWalkerFree queueFree
bool btreeLayerWalkerIter(queue_t *queue, btree_leaf_t **leafOut);

bool btreeCreatorInit(btree_creator_t *creator, btree_t *btree);
void btreeCreatorFree(btree_creator_t *creator);
bool btreeCreatorIter(btree_creator_t *creator, bool pass,
    btree_leaf_t **leafOut);

#ifdef __cplusplus
}
#endif

#endif

