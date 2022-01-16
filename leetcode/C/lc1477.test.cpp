#include <gtest.h>
#include "test.h"
using namespace testing;

int* readArr(const char* filename, int *length, int *target)
{
    FILE *fp = fopen(filename, "r");
    if (NULL == fp) {
        return NULL;
    }
    fscanf(fp, "%d%d", length, target);
    int *arr = (int*)malloc(sizeof(int) * (*length));
    if (NULL == arr) {
        fclose(fp);
        return arr;
    }
    for(int i = 0; i < *length; i++){
        fscanf(fp, "%d", arr + i);
    }
    fclose(fp);
    return arr;
}
TEST(LeetCode_1477, test0)
{
    int length, target;
    int *arr = readArr("./lc1477_1.txt", &length, &target);
    if (NULL == arr) {
        FAIL() << "Failed to load test case file.\n";
        return;
    }
    EXPECT_EQ(4, minSumOfLengths(arr, length, target));
    free(arr);arr=NULL;
}
TEST(LeetCode_1477, test1)
{
    int length, target;
    int *arr = readArr("./lc1477_2.txt", &length, &target);
    if (NULL == arr) {
        FAIL() << "Failed to load test case file.\n";
        return;
    }
    EXPECT_EQ(100000, minSumOfLengths(arr, length, target));
    free(arr);arr=NULL;
}

