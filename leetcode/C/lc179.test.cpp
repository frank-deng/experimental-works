#include <gtest/gtest.h>
#include "test.h"
using namespace testing;

TEST(LeetCode_179, test0)
{
    int nums[] = {10,2};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("210", result);
    free(result);
}
TEST(LeetCode_179, test1)
{
    int nums[] = {3,30,34,5,94};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("94534330", result);
    free(result);
}
TEST(LeetCode_179, test2)
{
    int nums[] = {1};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("1", result);
    free(result);
}
TEST(LeetCode_179, test3)
{
    int nums[] = {10};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("10", result);
    free(result);
}
TEST(LeetCode_179, test4)
{
    int nums[] = {34323,3432};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("343234323", result);
    free(result);
}
TEST(LeetCode_179, test5)
{
    int nums[] = {0,0};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("0", result);
    free(result);
}
TEST(LeetCode_179, test6)
{
    int nums[] = {0,0,0};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("0", result);
    free(result);
}
TEST(LeetCode_179, test7)
{
    int nums[] = {999999998,999999997,999999999};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("999999999999999998999999997", result);
    free(result);
}

