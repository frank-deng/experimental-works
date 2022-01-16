#include <gtest.h>
#include "test.h"
using namespace testing;

TEST(LeetCode_33, test0)
{
    int nums[] = {4,5,6,7,0,1,2}, target = 0;
    EXPECT_EQ(4, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}
TEST(LeetCode_33, test1)
{
    int nums[] = {7,0,1,2,3,4,5,6}, target = 5;
    EXPECT_EQ(6, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}
TEST(LeetCode_33, test2)
{
    int nums[] = {4,5,6,7,0,1,2}, target = 3;
    EXPECT_EQ(-1, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}
TEST(LeetCode_33, test3)
{
    int nums[] = {1}, target = 0;
    EXPECT_EQ(-1, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}
TEST(LeetCode_33, test4)
{
    int nums[] = {1}, target = 1;
    EXPECT_EQ(0, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}
TEST(LeetCode_33, test5)
{
    int nums[] = {1, 3}, target = 3;
    EXPECT_EQ(1, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}
TEST(LeetCode_33, test6)
{
    int nums[] = {1, 3, 5}, target = 3;
    EXPECT_EQ(1, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}
TEST(LeetCode_33, test7)
{
    int nums[] = {3, 1}, target = 3;
    EXPECT_EQ(0, searchRotatedArr(nums,
        sizeof(nums) / sizeof(nums[0]), target));
}

