const assert=require('assert');
const Heap=require('./heap');
const Median=require('./median');

describe('堆数据结构',function(){
  it('基本功能测试',function(){
    let heap=new Heap(Heap.MIN_HEAP);
    heap.push(3);
    heap.push(4);
    heap.push(1);
    assert.deepStrictEqual(heap.data,[1,4,3]);
    assert.strictEqual(heap.pop(),1);
  });
  it('各种异常操作',function(){
    assert.throws(()=>new Heap(),Error,'Heap type not specified.');
    assert.throws(()=>new Heap(666),TypeError,'Invalid heap type.');
    let heap=new Heap(Heap.MIN_HEAP);
    assert.strictEqual(heap.pop(),undefined);
    heap.push(3);
    heap.push(4);
    heap.push(1);
    heap.length=666;
    assert.strictEqual(heap.length,3);
  });
  it('进堆',function(){
    let heap=new Heap(Heap.MIN_HEAP);
    heap.push(3);
    heap.push(4);
    heap.push(2);
    heap.push(6);
    heap.push(5);
    assert.deepStrictEqual(heap.data,[2,4,3,6,5]);
    heap.push(1);
    assert.deepStrictEqual(heap.data,[1,4,2,6,5,3]);
    let heap2=new Heap(Heap.MAX_HEAP);
    heap2.push(3);
    heap2.push(4);
    heap2.push(2);
    heap2.push(6);
    heap2.push(5);
    heap2.push(1);
    assert.deepStrictEqual(heap2.data,[6,5,2,3,4,1]);
  });
  it('出堆',function(){
    let heap=new Heap(Heap.MIN_HEAP);
    heap.push(3);
    heap.push(4);
    heap.push(2);
    heap.push(6);
    heap.push(5);
    heap.push(1);
    assert.strictEqual(heap.pop(),1);
    assert.deepStrictEqual(heap.data,[2,4,3,6,5]);
    heap=new Heap(Heap.MIN_HEAP);
    heap.push(1);
    heap.push(2);
    heap.push(3);
    heap.push(4);
    heap.push(5);
    heap.push(6);
    heap.push(70);
    assert.strictEqual(heap.pop(),1);
    assert.deepStrictEqual(heap.data,[2,4,3,70,5,6]);
    assert.strictEqual(heap.pop(),2);
    assert.deepStrictEqual(heap.data,[3,4,6,70,5]);
    let heap2=new Heap(Heap.MAX_HEAP);
    heap2.push(3);
    heap2.push(4);
    heap2.push(2);
    heap2.push(6);
    heap2.push(5);
    heap2.push(1);
    assert.strictEqual(heap2.pop(),6);
    assert.deepStrictEqual(heap2.data,[5,4,2,3,1]);
    assert.strictEqual(heap2.pop(),5);
    assert.deepStrictEqual(heap2.data,[4,3,2,1]);
  });
}); 
describe('中位数测试',function(){
  it('测试1',function(){
    assert.strictEqual(new Median([1,2,3,4,5,6,7,8,9,10,11]).get(),6);
  });
});

