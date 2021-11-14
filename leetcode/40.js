module.exports=function(arr,target){
    let candidates=arr.slice(), table={}, len=arr.length, path=[], result=[];
    candidates.sort((a,b)=>(a-b));
    function _proc(offset=0,sum=0){
        if(sum==target){
            let key=path.join(',');
            if(!table[key]){
                table[key]=true;
                result.push(path.slice());
            }
            return;
        }else if(sum>target){
            return;
        }
        for(let i=offset;i<len;i++){
            path.push(candidates[i]);
            _proc(i+1,sum+candidates[i]);
            path.pop();
        }
    }
    _proc();
    return result;
}

