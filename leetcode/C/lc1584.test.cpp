#include "test.h"

TEST(LeetCode_1584, test0)
{
    int i;
    int pointData[][2] = {
        {0, 0}, {2, 2}, {3, 10}, {5, 2}, {7, 0}
    };
    int pointDataCount = sizeof(pointData) / sizeof(pointData[0]);
    int *data[pointDataCount] = { 0 };
    for (i = 0; i < pointDataCount; i++) {
        data[i] = pointData[i];
    }
    EXPECT_EQ(20, minCostConnectPoints(data, pointDataCount, NULL));
}
TEST(LeetCode_1584, test1)
{
    int i;
    int pointData[][2] = {
        {3,12}, {-2,5}, {-4,1},
    };
    int pointDataCount = sizeof(pointData) / sizeof(pointData[0]);
    int *data[pointDataCount] = { 0 };
    for (i = 0; i < pointDataCount; i++) {
        data[i] = pointData[i];
    }
    EXPECT_EQ(18, minCostConnectPoints(data, pointDataCount, NULL));
}
TEST(LeetCode_1584, test2)
{
    int i;
    int pointData[][2] = {
        {0,0}, {1,1}, {1,0}, {-1,1}
    };
    int pointDataCount = sizeof(pointData) / sizeof(pointData[0]);
    int *data[pointDataCount] = { 0 };
    for (i = 0; i < pointDataCount; i++) {
        data[i] = pointData[i];
    }
    EXPECT_EQ(4, minCostConnectPoints(data, pointDataCount, NULL));
}
TEST(LeetCode_1584, test3)
{
    int i;
    int pointData[][2] = {
        {0,0}
    };
    int pointDataCount = sizeof(pointData) / sizeof(pointData[0]);
    int *data[pointDataCount] = { 0 };
    for (i = 0; i < pointDataCount; i++) {
        data[i] = pointData[i];
    }
    EXPECT_EQ(0, minCostConnectPoints(data, pointDataCount, NULL));
}
TEST(LeetCode_1584, test4)
{
    int i;
    int pointData[][2] = {
        {-1000000,-1000000}, {1000000,1000000}
    };
    int pointDataCount = sizeof(pointData) / sizeof(pointData[0]);
    int *data[pointDataCount] = { 0 };
    for (i = 0; i < pointDataCount; i++) {
        data[i] = pointData[i];
    }
    EXPECT_EQ(4000000, minCostConnectPoints(data, pointDataCount, NULL));
}
TEST(LeetCode_1584, test5)
{
    int i;
    int pointData[][2] = {
        {2,-3}, {-17,-8}, {13,8}, {-17,-15}
    };
    int pointDataCount = sizeof(pointData) / sizeof(pointData[0]);
    int *data[pointDataCount] = { 0 };
    for (i = 0; i < pointDataCount; i++) {
        data[i] = pointData[i];
    }
    EXPECT_EQ(53, minCostConnectPoints(data, pointDataCount, NULL));
}
TEST(LeetCode_1584, test6)
{
    int i;
    int pointData[][2] = {
        {2,-3}, {-17,-8}, {13,8}, {-17,-15}
    };
    int pointDataCount = sizeof(pointData) / sizeof(pointData[0]);
    int *data[pointDataCount] = { 0 };
    for (i = 0; i < pointDataCount; i++) {
        data[i] = pointData[i];
    }
    EXPECT_EQ(53, minCostConnectPoints(data, pointDataCount, NULL));
}

