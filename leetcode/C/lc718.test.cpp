#include "test.h"

TEST(LeetCode_718, test0)
{
    int data[] = {10,5,2,6};
    EXPECT_EQ(8, numSubarrayProductLessThanK(data, sizeof(data) / sizeof(data[0]), 100));
}
TEST(LeetCode_718, test1)
{
    int data[] = {1,2,3};
    EXPECT_EQ(0, numSubarrayProductLessThanK(data, sizeof(data) / sizeof(data[0]), 0));
}
