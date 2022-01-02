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
    char buf[16] = "";
    if (leaf == NULL) {
        sprintf(buf, "-1\t");
    } else {
        sprintf(buf, "%u\t", *(uint16_t*)(leaf->data));
    }
    strcat((char*)data, buf);
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

    char buf[2048] = "";
    btreeWalkByLayer(&btree, btreeWalkCB, buf);
    puts(buf);

    btreeFree(&btree);
}
int main(int argc, char *argv[])
{
    InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

