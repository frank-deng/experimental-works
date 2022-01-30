#include <gtest/gtest.h>
#include "test.h"
using namespace testing;

#define MAX_SIZE 32
typedef struct {
    size_t length;
    int data[MAX_SIZE];
} answer_item_t;
TEST(LeetCode_78, test1)
{
    int nums[] = {1,2,3};
    answer_item_t answersAll[8] = {
        {0, NULL},
        {1, {1}},
        {1, {2}},
        {1, {3}},
        {2, {1,2}},
        {2, {1,3}},
        {2, {2,3}},
        {3, {1,2,3}}
    };
    int returnSize = 0;
    int *colSize = NULL;
    int **result = subsets(nums, sizeof(nums)/sizeof(nums[0]),
        &returnSize, &colSize);
    EXPECT_EQ(1 << (sizeof(nums)/sizeof(nums[0])), returnSize);
    for (int i = 0; i < returnSize; i++) {
        EXPECT_EQ(answersAll[i].length, colSize[i]);
        if (colSize[i]) {
            EXPECT_EQ(0, memcmp(result[i], answersAll[i].data,
                sizeof(int) * colSize[i]));
            free(result[i]);
        }
    }
    free(result);
    free(colSize);
}

