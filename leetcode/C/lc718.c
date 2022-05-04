#include "test.h"

int numSubarrayProductLessThanK(int* nums, int numsSize, int k){
    size_t left = 0, right = 0;
    int multi = 1, result = 0;
    for (right = 0; right < numsSize; right++) {
        multi *= nums[right];
        while (left <= right && multi >= k) {
            multi /= nums[left];
            left++;
        }
        result += right - left + 1;
    }
    return result;
}
