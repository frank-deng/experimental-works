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
int myAtoi(const char *s);
double myPow(double x, int n);
int* getAllElements(struct TreeNode*, struct TreeNode*, int*);
int compareVersion(const char *ver0, const char *ver1);
bool validUtf8(int *data, int dataSize);

#ifdef __cplusplus
}
#endif

#endif

