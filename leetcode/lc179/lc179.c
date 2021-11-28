#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>

static unsigned long digitsVal[] = {
    1, 10, 100, 1000,
    10000,
    100000,
    1000000,
    10000000,
    100000000,
    1000000000,
    10000000000,
    100000000000,
    1000000000000
};
inline static uint8_t mydigits(unsigned long a)
{
    unsigned char digits = 0;
    while(a){
        digits++;
        a /= 10;
    }
    return digits ? digits : 1;
}
inline static int __compare(int a, int b)
{
    unsigned long valA = a * digitsVal[mydigits(b)] + b;
    unsigned long valB = b * digitsVal[mydigits(a)] + a;
    return valB - valA;
}
inline static void __insertSort(int *arr, size_t size)
{
    for (size_t i = 0; i < size; i++) {
        for (size_t j = i; j > 0 && __compare(arr[j - 1], arr[j]) > 0; j--) {
            int temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;
        }
    }
}
static void __qsortPart(int *arr, size_t size)
{
    if (size <= 16) {
        __insertSort(arr, size);
        return;
    }

    size_t midIdx = (size >> 1);
    int a = *arr, c = arr[size-1], b = arr[midIdx];
    {
        int temp = *arr;
        if ((a <= b && b <= c) || (c <= b && b <= a)){
            *arr = arr[midIdx];
            arr[midIdx] = temp;
        } else if ((a <= c && c <= b) || (b <= c && c <= a)) {
            *arr = arr[size-1];
            arr[size-1] = temp;
        }
    }

    int pivotVal = *arr;
    int *left = arr;
    int *right = arr + size - 1;
    while (left < right) {
        while (left < right && __compare(*left, pivotVal) <= 0) {
            left++;
        }
        while (right > arr && __compare(pivotVal, *right) <= 0) {
            right--;
        }
        if (left < right) {
            int temp = *left;
            *left = *right;
            *right = temp;
        }
    }
    *arr = *right;
    *right = pivotVal;
    __qsortPart(arr, right - arr);
    __qsortPart(right + 1, size - (right - arr)  - 1);
}
static void __qsort(int *arr, size_t length)
{
    __qsortPart(arr, length);
}
char *largestNumber(int *nums, int size)
{
    char *result = (char*)malloc(sizeof(char) * size * 10);
    if (result == NULL) {
        return NULL;
    }
    //qsort(nums, size, sizeof(int), __compare);
    __qsort(nums, size);
    char *p = result;
    for (int i = 0; i < size; i++){
        int ret = sprintf(p, "%d", nums[i]);
        if (ret >= 0) {
            p += ret;
        }
    }
    //Check whether result is all zero
    p = result;
    bool allZero = true;
    while(*p){
        if(*p != '0'){
            allZero = false;
            break;
        }
        p++;
    }
    if (allZero) {
        strcpy(result, "0");
    }
    return result;
}
int main(size_t argc, char *argv[]){
    if (argc < 2) {
        printf("Usage: %s num1 num2 ...", argv[0]);
        return 1;
    }

    char buf[16] = "", *p = NULL, *err = NULL;
    size_t size = argc - 1;
    int *nums = (int*)malloc(sizeof(int) * size);
    if (nums == NULL) {
        puts("Memory allocation error.");
        return 1;
    }
    for (size_t i = 0; i < size; i++){
        if (strlen(argv[i + 1]) >= 16) {
            err = "Input number too large.";
            break;
        }
        int value = strtoul(argv[i + 1], &p, 10);
        if (*p != '\0' || value < 0) {
            err = "Invalid number.";
            break;
        }
        nums[i] = value;
    }
    if (err != NULL) {
        puts(err);
    } else {
        char *result = largestNumber(nums, size);
        if (result != NULL) {
            puts(result);
            free(result);
            result = NULL;
        }
    }
    free(nums);
    nums = NULL;
    return 0;
}

