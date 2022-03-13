#include <gtest/gtest.h>
#include "test.h"
using namespace testing;

void str2arr(const char *str, int *arr)
{
    uint8_t *p = (uint8_t*)str;
    for (size_t i = 0; *p != '\0'; p++, i++) {
        arr[i] = *p;
    }
}
TEST(LeetCode_393, test1)
{
    int arr[] = { 197, 130, 1 };
    EXPECT_EQ(true, validUtf8(arr, sizeof(arr) / sizeof(arr[0])));
    int arr2[] = { 235, 140, 4 };
    EXPECT_EQ(false, validUtf8(arr2, sizeof(arr2) / sizeof(arr2[0])));
    int arr3[] = { 248, 130, 130, 130 };
    EXPECT_EQ(false, validUtf8(arr2, sizeof(arr2) / sizeof(arr2[0])));
}
TEST(LeetCode_393, test2)
{
#define STRING_1 "abc"
#define STRING_2 "中文输入法"
    int arr[1000];
    str2arr(STRING_1, arr);
    EXPECT_EQ(true, validUtf8(arr, strlen(STRING_1)));
    str2arr(STRING_2, arr);
    EXPECT_EQ(true, validUtf8(arr, strlen(STRING_2)));
}

