#include "test.h"

TEST(LeetCode_1305, test0)
{
    struct TreeNode tree0Left = { 1, NULL, NULL };
    struct TreeNode tree0Right = { 4, NULL, NULL };
    struct TreeNode tree0 = { 2, &tree0Left, &tree0Right };
    struct TreeNode tree1Left = { 0, NULL, NULL };
    struct TreeNode tree1Right = { 3, NULL, NULL };
    struct TreeNode tree1 = { 1, &tree1Left, &tree1Right };
    int returnSize = 0;
    int *result = getAllElements(&tree0, &tree1, &returnSize);
    int resultRef[] = {0, 1, 1, 2, 3, 4};
    EXPECT_EQ(6, returnSize);
    if (returnSize) {
        for (int i = 0; i < returnSize; i++) {
            EXPECT_EQ(resultRef[i], result[i]);
        }
        free(result);
    }
}

