#include "test.h"

static inline int _bsearch(int *arr, size_t length, int target)
{
    if (length <= 0) {
        return -1;
    }
    size_t start = 0, end = length;
    while (start < end) {
        size_t mid = start + ((end - start) >> 1);
        if (target == arr[mid]) {
            return mid;
        } else if (target < arr[mid]) {
            end = mid;
        } else {
            start = mid + 1;
        }
    }
    return -1;
}
int searchRotatedArr(int* nums, int numSize, int target)
{
    if (numSize <= 0) {
        return -1;
    }
    size_t start = 0, end = numSize;
    while (start < end) {
        size_t mid = start + ((end - start) >> 1);
        if (nums[mid] == target) {
            return mid;
        } else if (start >= mid) {
            start++;
        } else if ((mid + 1) >= end) {
            end--;
        } else if (nums[start] < nums[mid - 1]) {
            if (nums[start] <= target && target <= nums[mid - 1]) {
                int result = _bsearch(nums + start, mid - start, target);
                return result == -1 ? -1 : start + result;
            }
            start = mid;
        } else if (nums[mid] < nums[end - 1]) {
            if (nums[mid] <= target && target <= nums[end - 1]) {
                int result = _bsearch(nums + mid, end - mid, target);
                return result == -1 ? -1 : mid + result;
            }
            end = mid;
        }
    }
    return -1;
}

