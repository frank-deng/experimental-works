#include "test.h"

TEST(LeetCode_8, test_8)
{
    EXPECT_EQ(8, myAtoi("8"));
}
TEST(LeetCode_8, test_8086)
{
    EXPECT_EQ(8086, myAtoi("8086"));
}
TEST(LeetCode_8, test_8a)
{
    EXPECT_EQ(8, myAtoi("8a"));
}
TEST(LeetCode_8, test_hahaha)
{
    EXPECT_EQ(0, myAtoi("hahaha"));
}
TEST(LeetCode_8, test_neg8a)
{
    EXPECT_EQ(-8, myAtoi("-8a"));
}
TEST(LeetCode_8, test_neg86)
{
    EXPECT_EQ(-86, myAtoi("-86"));
}
TEST(LeetCode_8, test_neg86_spc)
{
    EXPECT_EQ(-86, myAtoi("   -86"));
}
TEST(LeetCode_8, test_neg86_spc2)
{
    EXPECT_EQ(-86, myAtoi("   -86   "));
}
TEST(LeetCode_8, test_2147483647)
{
    EXPECT_EQ(2147483647, myAtoi("2147483647"));
}
TEST(LeetCode_8, test_12147483647)
{
    EXPECT_EQ(2147483647, myAtoi("12147483647"));
}
TEST(LeetCode_8, test_neg2147483648)
{
    EXPECT_EQ(-2147483648, myAtoi("-2147483648"));
}
TEST(LeetCode_8, test_neg12147483647)
{
    EXPECT_EQ(-2147483648, myAtoi("-12147483648"));
}
TEST(LeetCode_8, test_words_and_987)
{
    EXPECT_EQ(0, myAtoi("words and 987"));
}
TEST(LeetCode_8, test_neg91283472332)
{
    EXPECT_EQ(-2147483648, myAtoi("-91283472332"));
}
TEST(LeetCode_8, test_p86)
{
    EXPECT_EQ(86, myAtoi("+86"));
}

