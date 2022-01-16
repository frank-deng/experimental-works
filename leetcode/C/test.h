#ifndef test_h
#define test_h

#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>

#ifdef __cplusplus
extern "C" {
#endif

int searchRotatedArr(int*, int, int);
char *largestNumber(int*, int);
int *maxSlidingWindow(int*, int, int, int*);
char **findRepeatedDnaSequences(char*, int*);
int containVirus(int**, int, int*);

#ifdef __cplusplus
}
#endif

#endif

