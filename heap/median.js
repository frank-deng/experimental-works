const Heap=require('./heap');
class Median{
  constructor(nums){
    this.__minHeap=new Heap(Heap.MIN_HEAP);
    this.__maxHeap=new Heap(Heap.MAX_HEAP);
    if(Array.isArray(nums)){
      for(let n of nums){
        this.write(n);
      }
    }
  }
  reset(){
    this.__minHeap.reset();
    this.__maxHeap.reset();
  }
  write(value){
    if(isNaN(value)){
      throw TypeError('Number value required');
    }

    //最小堆为空
    if(!this.__maxHeap.length){
      this.__maxHeap.push(value);
      return this;
    }

    //需要插入到最大堆
    let maxHeapTop=this.__maxHeap.peek();
    if(value<maxHeapTop){
      this.__maxHeap.push(value);
      if((this.__maxHeap.length-this.__minHeap.length)>1){
        this.__minHeap.push(this.__maxHeap.pop());
      }
      return this;
    }

    //最小堆为空
    if(!this.__minHeap.length){
      this.__minHeap.push(value);
      return this;
    }

    //需要插入到最小堆
    let minHeapTop=this.__minHeap.peek();
    if(value>minHeapTop){
      this.__minHeap.push(value);
      if(this.__minHeap.length>this.__maxHeap.length){
        let popValue=this.__minHeap.pop();
        this.__maxHeap.push(popValue);
      }
      return this;
    }

    if(this.__maxHeap.length>this.__minHeap.length){
      this.__minHeap.push(value);
    }else{
      this.__maxHeap.push(value);
    }

    return this;
  }
  get(){
    if(!this.__minHeap.length && !this.__maxHeap.length){
      return undefined;
    }else if(this.__minHeap.length != this.__maxHeap.length){
      return this.__maxHeap.peek();
    }else{
      return [this.__maxHeap.peek(),this.__minHeap.peek()];
    }
  }
}
module.exports=Median;

