module.exports=class{
    constructor(n,k){
        this.__maxVal=n;
        this.__arr=[];
        for(let i=0;i<k;i++){
            this.__arr.push(i);
        }
    }
    [Symbol.iterator](){
        return this;
    }
    next(){
        let arr=this.__arr, len=arr.length, maxVal=this.__maxVal;
        if(arr[0]>=(maxVal-len+1)){
            return{
                done:true
            };
        }
        let value=arr.slice();
        for(let i=len-1;i>=0;i--){
            arr[i]++;
            if(arr[i]>=(maxVal-len+i+1)){
                continue;
            }
            if(i>=len-1){
                break;
            }
            let newVal=arr[i];
            for(let j=i+1;j<len;j++){
                arr[j]=++newVal;
            }
            break;
        }
        return {
            done:false,
            value
        };
    }
}
