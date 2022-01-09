#include <gtest.h>
#include "test.h"
using namespace testing;

TEST(LeetCode_179, test0)
{
    int nums[] = {3,30,34,5,94};
    char *result = largestNumber(nums, sizeof(nums) / sizeof(nums[0]));
    EXPECT_STREQ("94534330", result);
    free(result);
}

