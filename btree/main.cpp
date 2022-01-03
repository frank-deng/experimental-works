#include <gtest.h>
using namespace testing;

#include "queue.h"
#include "btree.h"
#include "stack.h"

TEST(queue, test)
{
#define QUEUE_BLOCK_SIZE 4
    queue_t queue;
    queueInit(&queue, sizeof(int), QUEUE_BLOCK_SIZE);
    int i, val;
    for (i = 0; i < 3; i++) {
        EXPECT_EQ(true, queuePush(&queue, &i));
    }
    for (i = 0; i < 3; i++) {
        EXPECT_EQ(true, queuePop(&queue, &val));
        EXPECT_EQ(i, val);
    }
    for (i = 0; i < 30; i++) {
        EXPECT_EQ(true, queuePush(&queue, &i));
    }
    for (i = 0; i < 30; i++) {
        EXPECT_EQ(true, queuePop(&queue, &val));
        EXPECT_EQ(i, val);
    }
    for (i = 0; i < 3; i++) {
        EXPECT_EQ(true, queuePush(&queue, &i));
    }
    for (i = 0; i < 3; i++) {
        EXPECT_EQ(true, queuePop(&queue, &val));
        EXPECT_EQ(i, val);
    }
    queueFree(&queue);
#undef QUEUE_BLOCK_SIZE
}
TEST(stack, test)
{
    _stack_t stack;
    stackInit(&stack, sizeof(int), 6);
    int i, val;
    for (i = 0; i < 30; i++) {
        EXPECT_EQ(true, stackPush(&stack, &i));
    }
    for (i = 30; i > 0; i--) {
        EXPECT_EQ(true, stackPop(&stack, &val));
        EXPECT_EQ(i - 1, val);
    }
    stackFree(&stack);
#undef QUEUE_BLOCK_SIZE
}

void btreeWalkCB(const btree_leaf_t* const leaf, void* data)
{
    int value = -1;
    if (leaf != NULL) {
        value = (int)(*(uint16_t*)(leaf->data));
    }
    queuePush((queue_t*)data, &value);
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

    queue_t result;
    int value;
    queueInit(&result, sizeof(int), 0);

    queue_t walker;
    btreeLayerWalkerInit(&walker, &btree);
    leaf = NULL;
    while (btreeLayerWalkerIter(&walker, &leaf)) {
        value = (leaf == NULL ? -1 : (int)(*(uint16_t*)(leaf->data)));
        queuePush(&result, &value);
    }
    btreeLayerWalkerFree(&walker);

    btree_t btree2;
    btreeInit(&btree2, sizeof(uint16_t));

    btree_creator_t creator;
    btreeCreatorInit(&creator, &btree2);
    leaf = NULL;
    while (queuePop(&result, &value)) {
        bool pass = (value == -1);
        if (!btreeCreatorIter(&creator, pass, &leaf)) {
            break;
        }
        if (leaf != NULL) {
            *((uint16_t*)(leaf->data)) = (uint16_t)value;
        }
    }
    btreeCreatorFree(&creator);

    btreeLayerWalkerInit(&walker, &btree2);
    leaf = NULL;
    EXPECT_EQ(true, btreeLayerWalkerIter(&walker, &leaf));
    EXPECT_EQ(16, *(uint16_t*)(leaf->data));
    EXPECT_EQ(true, btreeLayerWalkerIter(&walker, &leaf));
    EXPECT_EQ(8, *(uint16_t*)(leaf->data));
    EXPECT_EQ(true, btreeLayerWalkerIter(&walker, &leaf));
    EXPECT_EQ(24, *(uint16_t*)(leaf->data));
    EXPECT_EQ(true, btreeLayerWalkerIter(&walker, &leaf));
    EXPECT_EQ(NULL, leaf);
    EXPECT_EQ(true, btreeLayerWalkerIter(&walker, &leaf));
    EXPECT_EQ(12, *(uint16_t*)(leaf->data));
    btreeLayerWalkerFree(&walker);

    queueFree(&result);
    btreeFree(&btree2);
    btreeFree(&btree);
}
int main(int argc, char *argv[])
{
    InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

