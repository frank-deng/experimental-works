#include "test.h"

TEST(LeetCode_165, test)
{
    EXPECT_EQ(0, compareVersion("1.0", "1.0.0"));
    EXPECT_EQ(0, compareVersion("1.01", "1.001"));
    EXPECT_EQ(0, compareVersion("1.01", "1.0001"));
    EXPECT_EQ(-1, compareVersion("0.1", "1.1"));
    EXPECT_EQ(1, compareVersion("1.05", "1.1"));
}

