function resultItemGen(pNum,pCount){
    let result=[],len=pNum.length;
    for(let i=0;i<len;i++){
        result=result.concat(new Array(pCount[i]).fill(pNum[i]));
    }
    return result;
}
module.exports=function(candidates,target){
    let result=[],pNum=[],pCount=[],len=candidates.length;
    function _proc(offset=0,sum=0){
        if(sum==target){
            result.push(resultItemGen(pNum,pCount));
            return;
        }else if(sum>target){
            return;
        }
        for(let i=offset;i<len;i++){
            let n=candidates[i], count=Math.floor((target-sum)/n);
            pNum.push(n);
            for(let j=count;j>0;j--){
                pCount.push(j);
                _proc(i+1,sum+n*j);
                pCount.pop();
            }
            pNum.pop();
        }
    }
    _proc();
    return result;
};

