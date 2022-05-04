#ifndef test_h
#define test_h

#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>

struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

#ifdef __cplusplus
extern "C" {
#endif

int searchRotatedArr(int*, int, int);
char *largestNumber(int*, int);
int *maxSlidingWindow(int*, int, int, int*);
char **findRepeatedDnaSequences(const char*, int*);
int containVirus(int**, int, int*);
int minSumOfLengths(int*, int, int);
int **subsets(int*, int, int*, int**);
int myAtoi(const char *);
double myPow(double, int);
int* getAllElements(struct TreeNode*, struct TreeNode*, int*);
int compareVersion(const char*, const char*);
bool validUtf8(int *, int);
int minCostConnectPoints(int**, int, int*);
int findBottomLeftValue(struct TreeNode*);
int** levelOrder(struct TreeNode*, int*, int**);

#ifdef __cplusplus
}
#endif

#ifdef __cplusplus
#include <gtest/gtest.h>
using namespace testing;
#endif

#endif

