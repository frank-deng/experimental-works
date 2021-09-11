/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function nextIdx(arr,idx){
    let target=idx+1;
    if(arr.length<=target){
        return target;
    }
    while(arr[idx]===arr[target]){
        target++;
    }
    return target;
}
function prevIdx(arr,idx){
    let target=idx-1;
    if(target<0){
        return target;
    }
    while(arr[idx]===arr[target]){
        target--;
    }
    return target;
}
module.exports = function(numsOrig) {
    let nums=numsOrig.slice(), result=[];
    nums.sort((a,b)=>(a-b));
    let idxBase=0;
    while(nums[idxBase]<=0 && idxBase<nums.length){
        let i=idxBase+1, j=nums.length-1;
        while(i<j && nums[j]>=0){
            if(0==(nums[idxBase]+nums[i]+nums[j])){
                result.push([nums[idxBase],nums[i],nums[j]]);
                i=nextIdx(nums,i);
            }else if((nums[idxBase]+nums[i]+nums[j]) > 0){
                j=prevIdx(nums,j);
            }else{
                i=nextIdx(nums,i);
            }
        }
        idxBase=nextIdx(nums,idxBase);
    }
    return result;
};

