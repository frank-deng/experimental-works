#include "test.h"
#include "util.h"

void freeResult(int size, int *columnSizes, int **result)
{
    int i;
    for (i = 0; i < size; i++) {
        free(result[i]);
    }
    free(result);
    free(columnSizes);
}
TEST(LeetCode_102, test0)
{
    struct TreeNode tree = { 666, NULL, NULL };
    int size = 0;
    int *columnSizes = NULL;
    int **result = levelOrder(&tree, &size, &columnSizes);
    EXPECT_EQ(1, size);
    EXPECT_EQ(1, columnSizes[0]);
    EXPECT_EQ(666, result[0][0]);
    freeResult(size, columnSizes, result);
}
TEST(LeetCode_102, test1)
{
    struct TreeNode tree1Left = { 2, NULL, NULL };
    struct TreeNode tree1Right= { 3, NULL, NULL };
    struct TreeNode tree1 = { 666, &tree1Left, &tree1Right };
    int size = 0;
    int *columnSizes = NULL;
    int **result = levelOrder(&tree1, &size, &columnSizes);
    EXPECT_EQ(2, size);
    EXPECT_EQ(1, columnSizes[0]);
    EXPECT_EQ(2, columnSizes[1]);
    EXPECT_EQ(666, result[0][0]);
    EXPECT_EQ(2, result[1][0]);
    EXPECT_EQ(3, result[1][1]);
    freeResult(size, columnSizes, result);
}
TEST(LeetCode_102, test2)
{
    int treeData[] = {3, 9, 20, -1, -1, 15, 7};
    struct TreeNode *tree = genTree(treeData,
        sizeof(treeData) / sizeof(treeData[0]));
    int size = 0;
    int *columnSizes = NULL;
    int **result = levelOrder(tree, &size, &columnSizes);
    freeTree(tree);
    EXPECT_EQ(3, size);
    EXPECT_EQ(1, columnSizes[0]);
    EXPECT_EQ(2, columnSizes[1]);
    EXPECT_EQ(2, columnSizes[2]);
    EXPECT_EQ(3, result[0][0]);
    EXPECT_EQ(9, result[1][0]);
    EXPECT_EQ(20, result[1][1]);
    EXPECT_EQ(15, result[2][0]);
    EXPECT_EQ(7, result[2][1]);
    freeResult(size, columnSizes, result);
}
TEST(LeetCode_102, test3)
{
    int treeData[] = {1, 2, 3, 4, -1, 5, 6, -1, -1, 7};
    struct TreeNode *tree = genTree(treeData,
        sizeof(treeData) / sizeof(treeData[0]));
    int size = 0;
    int *columnSizes = NULL;
    int **result = levelOrder(tree, &size, &columnSizes);
    freeTree(tree);
    EXPECT_EQ(4, size);

    EXPECT_EQ(1, columnSizes[0]);
    EXPECT_EQ(2, columnSizes[1]);
    EXPECT_EQ(3, columnSizes[2]);
    EXPECT_EQ(1, columnSizes[3]);

    EXPECT_EQ(1, result[0][0]);
    EXPECT_EQ(2, result[1][0]);
    EXPECT_EQ(3, result[1][1]);
    EXPECT_EQ(4, result[2][0]);
    EXPECT_EQ(5, result[2][1]);
    EXPECT_EQ(6, result[2][2]);
    EXPECT_EQ(7, result[3][0]);

    freeResult(size, columnSizes, result);
}
