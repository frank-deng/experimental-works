#include "test.h"

#define min(x,y) (x < y ? x : y)

int minSumOfLengths(int* arr, int length, int target)
{
    int left = 0, right = 0, sum = 0, result = length + 10;
    int *dpTable = (int*)malloc(sizeof(int) * (length + 1));
    dpTable[0] = length + 10;
    while(right < length){
        sum += arr[right];
        right++;
        while(sum > target){
            sum -= arr[left];
            left++;
        }
        if(sum == target){
            int len = right - left;
            result = min(result, len + dpTable[left]);
            dpTable[right] = min(dpTable[right-1], len);
        }else{
            dpTable[right] = dpTable[right-1];
        }
    }
    free(dpTable);
    return result > length ? -1 : result;
}

