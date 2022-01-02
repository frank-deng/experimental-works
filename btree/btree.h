#ifndef BTREE_H
#define BTREE_H

#include <stdbool.h>

typedef enum {
    BTREE_LEFT = 0,
    BTREE_RIGHT = 1,
} btree_pos_t;

typedef struct btree_leaf_s {
    struct btree_leaf_s *left;
    struct btree_leaf_s *right;
    char data[0];
} btree_leaf_t;

typedef struct {
    size_t leafSize;
    btree_leaf_t *root;
} btree_t;

#ifdef __cplusplus
extern "C" {
#endif

bool btreeInit(btree_t *btree, size_t dataSize);
void btreeFree(btree_t *btree);
btree_leaf_t* btreeInsertLeaf(btree_t *btree, btree_leaf_t *leaf,
    btree_pos_t pos);

#ifdef __cplusplus
}
#endif

#endif

