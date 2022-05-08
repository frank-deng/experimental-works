#include "test.h"

typedef int pointId_t;
typedef struct {
    pointId_t start;
    pointId_t end;
    int64_t distance;
} pointConn_t;
typedef struct{
	size_t length;
	size_t itemSize;
	size_t size;
	void* data;
}heap_t;
static int heapInit(heap_t* heap, size_t itemSize, size_t size)
{
	heap->length=0;
	heap->size=size;
	heap->itemSize=itemSize;
	heap->data=(void*)malloc(itemSize*size);
	return heap->data != NULL ? 1 : 0;
}
static void heapClose(heap_t *heap)
{
	if (heap->data != NULL) {
		free(heap->data);
		heap->data=NULL;
	}
	heap->length=heap->size=heap->itemSize=0;
}
#define __swap(type, arr, p0, p1) do{\
	type temp = (arr)[(p0)];\
	(arr)[(p0)] = (arr)[(p1)];\
	(arr)[(p1)] = (temp);\
}while(0)

typedef pointConn_t* item_t;
static inline int __compare(item_t a, item_t b)
{
    return a->distance - b->distance;
}
static int heapPush(heap_t *heap, item_t value){
	size_t sizeNew;
	void* dataNew;
	size_t pos=heap->length, parentPos;
	item_t *heapData;

	/* Handle heap push */
	heapData=(item_t*)(heap->data);
	heapData[heap->length]=value;
	heap->length++;
	while(pos){
		parentPos=(pos-1)>>1;
		if(__compare(heapData[parentPos], heapData[pos]) <= 0){
			break;
		}
		__swap(item_t, heapData, parentPos, pos);
		pos=parentPos;
	}
	return 1;
}
static int heapPop(heap_t *heap, item_t *item)
{
	item_t *arrData=(item_t*)(heap->data), heapTopOrig,
		value, leftVal, rightVal, temp;
	size_t pos=0, length, leftPos, rightPos;
	if(!(heap->length)){
		return 0;
	}
	*item = arrData[0];
	(heap->length)--;
	if(!(heap->length)){
		return 1;
	}
	arrData[0]=arrData[heap->length];
	length=heap->length;
	while(pos<length){
		value=arrData[pos]; leftPos=(pos<<1)+1; rightPos=(pos<<1)+2;
		if(rightPos>=length){
			if(leftPos>=length){
				break;
			}
			leftVal=arrData[leftPos];
			if(__compare(leftVal, value) < 0){
				__swap(item_t, arrData, leftPos, pos);
			}
			break;
		}
		leftVal=arrData[leftPos]; rightVal=arrData[rightPos];
		if(__compare(value, leftVal) <= 0 && __compare(value, rightVal) <= 0){
			break;
		}
		if(__compare(leftVal, rightVal) <= 0){
			__swap(item_t, arrData, leftPos, pos);
			pos=leftPos;
		}else{
			__swap(item_t, arrData, rightPos, pos);
			pos=rightPos;
		}
	}
	return 1;
}

int64_t calcDistance(int x0, int y0, int x1, int y1)
{
    int64_t dx = (int64_t)x0 - (int64_t)x1;
    int64_t dy = (int64_t)y0 - (int64_t)y1;
    if (dx < 0) {
        dx = -dx;
    }
    if (dy < 0) {
        dy = -dy;
    }
    return dx + dy;
}
pointConn_t* getConn(int** points, size_t pointsSize, size_t *size)
{
    if (pointsSize <= 0) {
        *size = 0;
        return NULL;
    }
    *size = pointsSize * (pointsSize - 1) / 2;
    pointConn_t *result = (pointConn_t*)calloc(sizeof(pointConn_t), *size);
    if (result == NULL) {
        return NULL;
    }
    size_t resultIdx = 0;
    for (size_t i = 0; i < pointsSize - 1; i++) {
        for (size_t j = i + 1; j < pointsSize; j++) {
            result[resultIdx].start = i;
            result[resultIdx].end = j;
            result[resultIdx].distance = calcDistance(points[i][0], points[i][1],
                points[j][0], points[j][1]);
            resultIdx++;
        }
    }
    return result;
}

typedef struct {
    size_t size;
    pointId_t data[0];
} group_t;
group_t *groupInit(size_t size)
{
    group_t* result = (group_t*)malloc(sizeof(group_t) + sizeof(pointId_t*) * size);
    if (NULL == result) {
        return NULL;
    }
    result->size = size;
    size_t i;
    for (i = 0; i < size; i++) {
        result->data[i] = -1;
    }
    return result;
}
void groupClose(group_t *group)
{
    free(group);
}
int acceptConn(group_t *group, pointId_t start, pointId_t end)
{
    if (group->data[start] < 0 && group->data[end] < 0) {
        group->data[start] = start;
        group->data[end] = start;
    } else if (group->data[start] >= 0 && group->data[end] < 0) {
        group->data[end] = group->data[start];
    } else if (group->data[start] < 0 && group->data[end] >= 0) {
        group->data[start] = group->data[end];
    } else if (group->data[start] == group->data[end]) {
        return 1;
    }
    size_t size = group->size, i;
    pointId_t groupStart = group->data[start];
    pointId_t groupEnd = group->data[end];
    for (i = 0; i < size; i++) {
        if (group->data[i] == groupEnd) {
            group->data[i] = groupStart;
        }
    }
    return 0;
}
int minCostConnectPoints(int** points, int pointsSize, int* pointsColSize)
{
    size_t i;
    size_t connLen = 0;
    pointConn_t *connData = getConn(points, (size_t)pointsSize, &connLen);
    if (connData == NULL) {
        return -1;
    }

    heap_t heap = { 0 };
    if (!heapInit(&heap, sizeof(pointConn_t*), connLen)) {
        return -1;
    }
    for (i = 0; i < connLen; i++) {
        heapPush(&heap, connData + i);
    }

    pointConn_t *conn;
    group_t *group = groupInit(pointsSize);
    if (NULL == group) {
        return -1;
    }
    int result = 0;
    while (heapPop(&heap, &conn)) {
        if (acceptConn(group, conn->start, conn->end) == 0) {
            result += conn->distance;
        }
    }
    groupClose(group);
    heapClose(&heap);
    free(connData);
    return result;
}
