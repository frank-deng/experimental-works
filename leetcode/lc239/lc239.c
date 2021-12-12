#include <stdio.h>
#include <stdbool.h>
#include <malloc.h>

typedef struct {
    int value;
    size_t idx;
} heapItem_t;
typedef struct {
    size_t size;
    size_t length;
    heapItem_t *data;
} maxHeap_t;
maxHeap_t *heapInit(size_t size)
{
    if (size <= 0) {
        return NULL;
    }
    maxHeap_t *heap = (maxHeap_t*)malloc(sizeof(maxHeap_t));
    if (heap == NULL) {
        return NULL;
    }
    heapItem_t *data = (heapItem_t*)malloc(sizeof(heapItem_t) * size);
    if (data == NULL) {
        free(heap);
        return NULL;
    }
    heap->size = size;
    heap->length = 0;
    heap->data = data;
    return heap;
}
void heapFree(maxHeap_t *heap)
{
    if (heap == NULL) {
        return;
    }
    if (heap->data != NULL) {
        free(heap->data);
        heap->data = NULL;
    }
    heap->size = heap->length = 0;
    free(heap);
}
static inline int __comp(heapItem_t *a, heapItem_t *b)
{
    if (a->value != b->value) {
        return a->value - b->value;
    }
    return b->idx - a->idx;
}
static inline void __swap(heapItem_t *arr, size_t a, size_t b)
{
    heapItem_t temp = {
        .value = arr[a].value,
        .idx = arr[a].idx
    };
    arr[a].value = arr[b].value;
    arr[a].idx = arr[b].idx;
    arr[b].value = temp.value;
    arr[b].idx = temp.idx;
}
bool heapTop(maxHeap_t *heap, heapItem_t *target)
{
    if (heap->length <= 0 || target == NULL) {
        return false;
    }
    target->value = heap->data[0].value;
    target->idx = heap->data[0].idx;
    return true;
}
bool heapPush(maxHeap_t *heap, int value, size_t idx)
{
    if (heap->length >= heap->size) {
        return false;
    }
    heapItem_t *arr = heap->data;
    arr[heap->length].value = value;
    arr[heap->length].idx = idx;
    (heap->length)++;
    size_t pos = heap->length - 1;
    while (pos) {
        size_t posParent = ((pos - 1) >> 1);
        if (__comp(arr + posParent, arr + pos) >= 0) {
            break;
        }
        __swap(arr, posParent, pos);
        pos = posParent;
    }
    return true;
}
bool heapPop(maxHeap_t *heap, heapItem_t *outVal)
{
    if (heap->length <= 0) {
        return false;
    }
    heapItem_t *arr = heap->data;
    if (outVal != NULL) {
        outVal->value = arr[0].value;
        outVal->idx = arr[0].idx;
    }
    (heap->length)--;
    if (heap->length == 0) {
        return true;
    }

    arr[0].value = arr[heap->length].value;
    arr[0].idx = arr[heap->length].idx;
    size_t pos = 0;
    while (pos < heap->length) {
        size_t posLeft = (pos << 1) + 1, posRight = (pos << 1) + 2;
        if (posLeft >= heap->length && posRight >= heap->length) {
            break;
        }
        if (posLeft < heap->length && posRight >= heap->length) {
            if (__comp(arr + posLeft, arr + pos) > 0) {
                __swap(arr, posLeft, pos);
            }
            break;
        }
        if (__comp(arr + pos, arr + posLeft) > 0 &&
            __comp(arr + pos, arr + posRight) > 0) {
            break;
        }
        if (__comp(arr + posLeft, arr + posRight) > 0) {
            __swap(arr, pos, posLeft);
            pos = posLeft;
        } else {
            __swap(arr, pos, posRight);
            pos = posRight;
        }
    }
    return true;
}
int *maxSlidingWindow(int *nums, int numsSize, int k, int *returnSize)
{
    int steps = numsSize - k + 1;
    int *result = (int*)malloc(sizeof(int) * (steps));
    if (result == NULL) {
        return NULL;
    }
    maxHeap_t* heap = heapInit(numsSize);
    if (heap == NULL) {
        free(result);
        return NULL;
    }
    *returnSize = steps;
    for (int i = 0; i < k; i++) {
        heapPush(heap, nums[i], i);
    }

    heapItem_t item;
    heapTop(heap, &item);
    result[0] = item.value;
    for (int idxStart = 1; idxStart < steps; idxStart++) {
        int idxEnd = idxStart + k - 1;
        do {
            if (!heapTop(heap, &item)) {
                break;
            }
            if (item.idx >= idxStart) {
                break;
            }
            heapPop(heap, NULL);
        } while (1);
        heapPush(heap, nums[idxEnd], idxEnd);
        heapTop(heap, &item);
        result[idxStart] = item.value;
    }
    heapFree(heap);
    heap = NULL;
    return result;
}
int main()
{
    size_t width = 0;
    size_t length = 0;
    if (scanf("%lu%lu", &width, &length) == EOF) {
        fputs("Invalid input.\n", stderr);
        return -1;
    }
    if (width > length) {
        fputs("Invalid input.\n", stderr);
        return -1;
    }
    int *data = (int*)malloc(sizeof(int) * length);
    if (data == NULL) {
        fputs("Memory allocation error.\n", stderr);
        return -1;
    }
    for (size_t i = 0; i < length; i++) { 
        if (scanf("%d", data + i) == EOF) {
            fputs("Invalid input.\n", stderr);
            return -1;
        }
    }
    int returnSize = 0;
    int *result = maxSlidingWindow(data, (int)length, (int)width, &returnSize);
    if (result == NULL) {
        fputs("Calculation failed.\n", stderr);
        return -1;
    }
    for (int i = 0; i < returnSize; i++) {
        printf("%d\t", result[i]);
    }
    putchar('\n');
    free(result);
    result = NULL;
    return 0;
}

