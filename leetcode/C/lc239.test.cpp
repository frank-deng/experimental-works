#include <gtest/gtest.h>
#include "test.h"
using namespace testing;

TEST(LeetCode_239, test0)
{
#define WINDOW_WIDTH 3
    int nums[] = {1,3,-1,-3,5,3,6,7};
    int length = 0;
    int *result = maxSlidingWindow(nums, sizeof(nums) / sizeof(nums[0]),
        WINDOW_WIDTH, &length);
    int expectResult[] = {3,3,5,5,6,7};
    EXPECT_EQ(sizeof(expectResult) / sizeof(expectResult[0]), length);
    EXPECT_EQ(0, memcmp(result, expectResult, sizeof(expectResult)));
    free(result);
#undef WINDOW_WIDTH
}

