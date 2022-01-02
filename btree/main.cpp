#include <gtest.h>
using namespace testing;

#include "queue.h"
#include "btree.h"

TEST(queue, basic)
{
}
TEST(btree, stringify)
{
    btree_t btree;
    btreeInit(&btree, sizeof(uint16_t));

    btree_leaf_t* leaf = NULL;
    leaf = btreeInsertLeaf(&btree, NULL, BTREE_LEFT);
    *((uint16_t*)(leaf->data)) = 16;
    leaf = btreeInsertLeaf(&btree, btree.root, BTREE_LEFT);
    *((uint16_t*)(leaf->data)) = 8;
    leaf = btreeInsertLeaf(&btree, btree.root, BTREE_RIGHT);
    *((uint16_t*)(leaf->data)) = 24;
    leaf = btreeInsertLeaf(&btree, btree.root->left, BTREE_RIGHT);
    *((uint16_t*)(leaf->data)) = 12;

    btreeFree(&btree);
}
int main(int argc, char *argv[])
{
    InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

