#include "test.h"

typedef unsigned char u8_t;
typedef unsigned int uint;
typedef u8_t(*callback_t)(uint*, uint, void*);
void combination(uint n, uint r, callback_t cb, void *data)
{
	uint *arr = NULL, i, j, newVal;
	arr = (uint*)malloc(sizeof(uint) * r);
	if (arr == NULL) {
		return;
	}
	for (i = 0; i < r; i++) {
		arr[i] = i;
	}
	while (arr[0] < (n - r + 1)) {
		if (!(*cb)(arr, r, data)) {
			break;
		}
		for (i = r; i > 0; i--) {
			arr[i - 1]++;
			if (arr[i - 1] >= (n - r + i)) {
				continue;
			}
			if (i >= r) {
				break;
			}
			newVal = arr[i - 1];
			for (j = i; j < r; j++) {
				newVal++;
				arr[j] = newVal;
			}
			break;
		}
	}
	free(arr);
}
typedef struct {
    int *nums;
    size_t *resultIdx;
    int *itemSizeArr;
    int **result;
} handler_data_t;
static u8_t __comb_handler(uint* idxArr, uint length, void* dataRaw)
{
    handler_data_t* data = (handler_data_t*)dataRaw;
    size_t resultIdx = *(data->resultIdx);
    data->itemSizeArr[resultIdx] = length;
    int *rowResult = (int*)malloc(sizeof(int) * length);
    for (uint i = 0; i < length; i++) {
        rowResult[i] = data->nums[idxArr[i]];
    }
    data->result[resultIdx] = rowResult;
    (*(data->resultIdx))++;
    return 1;
}
int **subsets(int *nums, int length, int *returnSize, int** colSize)
{
    int resultLen = (1 << length);
    int *itemSizeArr = (int*)malloc(sizeof(int) * (resultLen));
    int **result = (int**)malloc(sizeof(int*) * (resultLen));
    itemSizeArr[0] = 0;
    result[0] = NULL;
    size_t resultIdx = 1;
    handler_data_t __handler_data = {
        nums,
        &resultIdx,
        itemSizeArr,
        result
    };
    for (int r = 1; r <= length; r++) {
	    combination(length, r, __comb_handler, &__handler_data);
    }
    *returnSize = resultLen;
    *colSize = itemSizeArr;
    return result;
}

