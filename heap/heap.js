class Heap{
    type=0; //0=最小堆，1=最大堆
    data=[];
    constructor(type){
        this.type=type ? 1 : 0;
    }
    __parentAddr(idx){
        if(idx<=0){
            return undefined;
        }
        return (idx-1)>>1;
    }
    push(value){
        let addr=this.data.length;
        this.data.push(value);
        while(addr){
            let parentAddr=this.__parentAddr(addr);
            let parentValue=this.data[parentAddr];
            if((!this.type && parentValue>value) || (this.type && parentValue<value)){
                break;
            }
        }
        //链式操作用
        return this;
    }
    pop(){
        if(!this.data.length){
            return undefined;
        }
        let result=this.data[0];
    }
}
Object.defineProperty(Heap,'length',{
    configurable:false,
    enumerable:false,
    get(){
        return this.data.length;
    }
});
module.exports=Heap;
