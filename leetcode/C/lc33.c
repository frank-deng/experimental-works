#include "test.h"

int searchRotatedArr(int* nums, int numSize, int target)
{
    if (numSize <= 0) {
        return -1;
    }
    size_t idx;
    bool found = false;
    //后面考虑用二分法了
    for (int i = 0; i < numSize; i++) {
        if (nums[i] == target) {
            idx = i;
            found = true;
        }
    }
    return found ? idx : -1;
}

