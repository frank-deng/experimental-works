#include <stdio.h>
#include <stdbool.h>
#include <malloc.h>

typedef struct {
    int left;
    int right;
} range_item_t;
typedef struct {
    size_t length;
    range_item_t *data;
} range_arr_t;
range_arr_t *range_init(size_t size)
{
    range_arr_t *result=(range_arr_t*)malloc(sizeof(range_arr_t));
    result->length=0;
    result->data=(range_item_t*)malloc(sizeof(range_item_t)*size);
    return result;
}
void range_close(range_arr_t *target)
{
    free(target->data);
    free(target);
}
//插入排序使用
void range_add(range_arr_t *target, int left, int right)
{
    int insertLen=right-left, insertPoint;
    range_item_t *arr=target->data;
    for(insertPoint = 0; insertPoint < target->length; insertPoint++){
        int len=arr[insertPoint].right - arr[insertPoint].left;
        if(len>insertLen){
            break;
        }
    }
    for(int i=target->length; i>insertPoint; i--){
        arr[i].left=arr[i-1].left;
        arr[i].right=arr[i-1].right;
    }
    arr[insertPoint].left=left;
    arr[insertPoint].right=right;
    target->length++;
}
bool isOverlap(range_item_t *a, range_item_t *b)
{
    if ((a->left >= b->left && a->left < b->right) ||
        (a->right > b->left && a->right <= b->right) || 
        (b->left >= a->left && b->left < a->right)){
        return true;
    }
    return false;
}
int getResult(range_arr_t *target)
{
    int result=-1;
    for(int i=0 ; i < target->length-1; i++){
        for(int j = i+1; j < target->length; j++){
            range_item_t *prevItem = target->data + i,
                *item = target->data + j;
            if(isOverlap(prevItem, item)){
                continue;
            }
            int len = (prevItem->right - prevItem->left) + (item->right - item->left);
            if(-1 == result || len < result){
                result = len;
            }
            break;
        }
    }
    return result;
}
int minSumOfLengths(int* arr, int length, int target)
{
    int left=0, right=0, sum=0, result=-1;
    range_arr_t* range=range_init(length);
    while(left<length){
        if(sum==target){
            range_add(range, left, right);
            if(right>=length){
                break;
            }
            sum+=arr[right];
            right++;
        }else if(sum>target){
            sum-=arr[left];
            left++;
        }else if(right<length){
            sum+=arr[right];
            right++;
        }else{
            break;
        }
        if(left>=right){
            right=left;
            sum=0;
        }
    }
    do{
        if(range->length<2){
            break;
        }
        result = getResult(range);
    }while(0);
    range_close(range);
    range=NULL;
    return result;
}
int main(){
    int *arr=NULL, length, target;
    scanf("%d%d",&length,&target);
    arr=(int*)malloc(sizeof(int)*length);
    for(int i=0; i<length; i++){
        scanf("%d",arr+i);
    }
    printf("%d\n",minSumOfLengths(arr,length,target));
    free(arr);arr=NULL;
    return 0;
}

