#include "test.h"
#include "util.h"

TEST(LeetCode_513, test0)
{
    struct TreeNode tree0 = { 1, NULL, NULL };
    EXPECT_EQ(1, findBottomLeftValue(&tree0));
}
TEST(LeetCode_513, test1)
{
    struct TreeNode tree1Left = { 2, NULL, NULL };
    struct TreeNode tree1Right= { 3, NULL, NULL };
    struct TreeNode tree1 = { 1, &tree1Left, &tree1Right };
    EXPECT_EQ(2, findBottomLeftValue(&tree1));
}
TEST(LeetCode_513, test2)
{
    int treeData[] = {1, 2, 3, 4, -1, 5, 6, -1, -1, 7};
    struct TreeNode *tree = genTree(treeData,
        sizeof(treeData) / sizeof(treeData[0]));
    EXPECT_EQ(7, findBottomLeftValue(tree));
    freeTree(tree);
}

