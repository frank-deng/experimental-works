#include <gtest/gtest.h>
#include "test.h"
using namespace testing;

TEST(LeetCode_50, test_1)
{
    EXPECT_DOUBLE_EQ(1024.0, myPow(2, 10));
}
TEST(LeetCode_50, test_2)
{
    EXPECT_DOUBLE_EQ(1.0/1024.0, myPow(2, -10));
}
TEST(LeetCode_50, test_3)
{
    EXPECT_DOUBLE_EQ(7.59375, myPow(1.5, 5));
}

