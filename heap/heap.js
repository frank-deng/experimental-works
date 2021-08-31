class Heap{
  static MIN_HEAP=Symbol();
  static MAX_HEAP=Symbol();
  data=[];
  constructor(type=undefined){
    if(undefined===type){
      throw new Error('Heap type not specified.');
    }
    if(Heap.MIN_HEAP!==type && Heap.MAX_HEAP!==type){
      throw new TypeError('Invalid heap type.');
    }
    //Works similar to string.length or array.length
    Object.defineProperty(this,'length',{
      configurable:false,
      enumerable:false,
      get(){
        return this.data.length;
      }
    });
    this.type=type;
  }
  __parentAddr(idx){
    return idx<=0 ? undefined : (idx-1)>>1;
  }
  __leftChildAddr(idx){
    return (idx<<1)+1;
  }
  __rightChildAddr(idx){
    return (idx<<1)+2;
  }
  peek(){
    return this.data[0];
  }
  push(value){
    let addr=this.data.length;
    this.data.push(value);
    while(addr){
      let parentAddr=this.__parentAddr(addr);
      let parentValue=this.data[parentAddr];
      if((Heap.MIN_HEAP===this.type && parentValue<=value)
        || (Heap.MAX_HEAP===this.type && parentValue>=value)){
        break;
      }
      let temp=this.data[addr];
      this.data[addr]=this.data[parentAddr];
      this.data[parentAddr]=temp;
      addr=parentAddr;
    }
    //Chaining use
    return this;
  }
  pop(){
    let arr=this.data;
    //Heap is empty now
    if(!arr.length){
      return undefined;
    }

    //Get the root item and its value
    let result=arr[0];
    let tailItem=arr.pop();

    //Heap is empty now
    if(!arr.length){
      return result;
    }

    //Move the last item of the heap to top
    arr[0]=tailItem;
    
    //Move downwards if needed
    let addr=0,len=arr.length;
    while(addr<len){
      let leftChildAddr=this.__leftChildAddr(addr),
        rightChildAddr=this.__rightChildAddr(addr),
        currValue=arr[addr],
        leftValue=arr[leftChildAddr],
        rightValue=arr[rightChildAddr],
        target=null;
      if(Heap.MIN_HEAP===this.type
        && (currValue>leftValue || currValue>rightValue)){
        target=leftValue<rightValue ? leftChildAddr : rightChildAddr;
      }else if(Heap.MAX_HEAP===this.type
        && (currValue<leftValue || currValue<rightValue)){
        target=leftValue>rightValue ? leftChildAddr : rightChildAddr;
      }
      if(null===target){
        break;
      }
      let temp=arr[addr];
      arr[addr]=arr[target];
      arr[target]=temp;
      addr=target;
    }
    return result;
  }
}
module.exports=Heap;

