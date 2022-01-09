#include "test.h"

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
typedef struct{
    int *start;
    size_t length;
}qsortQueueItem_t;
typedef struct{
    unsigned long front;
    unsigned long rear;
    size_t size;
    qsortQueueItem_t *data;
}qsortQueue_t;
static inline bool __queueInit(qsortQueue_t *queue, size_t size){
    queue->front = queue->rear = 0;
    queue->size = size;
    queue->data = NULL;
    if(size <= 0) {
        return false;
    }
    queue->data = (qsortQueueItem_t*)malloc(sizeof(qsortQueueItem_t) * size);
    return (queue->data == NULL);
}
static inline void __queueClose(qsortQueue_t *queue){
    if(queue->data == NULL){
        return;
    }
    free(queue->data);
    queue->front = queue->rear = queue->size = 0;
    queue->data = NULL;
}
static bool __queueIn(qsortQueue_t *queue, qsortQueueItem_t *item){
    if (queue->rear - queue->front >= queue->size) {
        return false;
    }
    qsortQueueItem_t *target = queue->data + (queue->rear % queue->size);
    target->start = item->start;
    target->length = item->length;
    queue->rear++;
    return true;
}
static bool __queueOut(qsortQueue_t *queue, qsortQueueItem_t *target){
    if (queue->rear == queue->front) {
        return false;
    }
    qsortQueueItem_t *item = queue->data + (queue->front % queue->size);
    target->start = item->start;
    target->length = item->length;
    queue->front++;
    return true;
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
static void __qsort(int *arr0, size_t length)
{
    qsortQueue_t queue;
    qsortQueueItem_t queueItem = {
        arr0,
        length
    };
    __queueInit(&queue, length + 1);
    __queueIn(&queue, &queueItem);
    while(__queueOut(&queue, &queueItem)){
        int *arr = queueItem.start;
        size_t size = queueItem.length;

        if (size <= 16) {
            __insertSort(arr, size);
            continue;
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

        queueItem.start = arr;
        queueItem.length = right - arr;
        __queueIn(&queue, &queueItem);
        queueItem.start = right + 1;
        queueItem.length = size - (right - arr)  - 1;
        __queueIn(&queue, &queueItem);
    }
    __queueClose(&queue);
}
char *largestNumber(int *nums, int size)
{
    char *result = (char*)malloc(sizeof(char) * size * 10);
    if (result == NULL) {
        return NULL;
    }
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

