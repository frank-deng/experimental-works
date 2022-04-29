#include "test.h"

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
