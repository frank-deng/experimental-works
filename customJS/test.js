const assert=require('assert');
const {
  createNew,
  apply,
  call,
  bind,
  instanceOf
}=require('./index');

describe('createNew()',function(){
  it('Functionality test',function(){
    function TestClass(a,b){
      this.a=a;
      this.b=b;
    }
    TestClass.prototype={
      constructor:TestClass,
      calc(){
        return this.a+this.b;
      }
    }
    let testInstance=createNew(TestClass,1,2);
    let testInstance2=new TestClass(1,2);
    assert.strictEqual(testInstance.calc(),3);
    assert.strictEqual(testInstance2.calc(),3);
    assert.strictEqual(testInstance.calc,testInstance2.calc);
  });
  it('Constructor return non-object value',function(){
    function TestClass(value){
      return value;
    }
    let testInstance=createNew(TestClass,'666');
    let testInstance2=new TestClass('666');
    assert.strictEqual(testInstance instanceof TestClass,true);
    assert.strictEqual(testInstance2 instanceof TestClass,true);
  });
  it('Constructor return object value',function(){
    function TestClass(value){
      return {
        value
      };
    }
    let testInstance=createNew(TestClass,'666');
    let testInstance2=new TestClass('666');
    assert.deepStrictEqual(testInstance,{value:'666'});
    assert.deepStrictEqual(testInstance2,{value:'666'});
  });
});
describe('call()和apply()',function(){
  it('Basic Test',function(){
    function Sum(initVal){
      this.value=initVal;
    }
    Sum.prototype={
      constructor:Sum,
      add(value){
        this.value+=value;
        return this;
      },
      getValue(){
        return this.value;
      }
    }
    let sum0=createNew(Sum,1);
    let sum1=new Sum(2);
    assert.strictEqual(apply(Sum.prototype.getValue,sum0),1);
    assert.strictEqual(apply(Sum.prototype.getValue,sum1),2);
    apply(Sum.prototype.add,sum0,[2]);
    apply(Sum.prototype.add,sum1,[3]);
    assert.strictEqual(apply(Sum.prototype.getValue,sum0),3);
    assert.strictEqual(apply(Sum.prototype.getValue,sum1),5);
    call(Sum.prototype.add,sum0,10);
    call(Sum.prototype.add,sum1,20);
    assert.strictEqual(call(Sum.prototype.getValue,sum0),13);
    assert.strictEqual(call(Sum.prototype.getValue,sum1),25);
  });
});
describe('bind()',function(){
  it('Basic test',function(){
    function Sum(initVal){
      this.value=initVal;
    }
    Sum.prototype={
      ...Sum.prototype,
      add(value){
        this.value+=value;
        return this;
      },
      getValue(){
        return this.value;
      }
    }
    let sum0=createNew(Sum,1);
    let sum1=createNew(Sum,2);
    let add0=Sum.prototype.add.bind(sum0);
    let add1=Sum.prototype.add.bind(sum1);
    let func0=Sum.prototype.getValue.bind(sum0);
    let func1=bind(Sum.prototype.getValue,sum1);
    add0(10);
    add1(20);
    assert.strictEqual(func0(),11);
    assert.strictEqual(func1(),22);
    assert.strictEqual(Sum.prototype.getValue(),undefined);
  });
  it('Create object with bind()',function(){
    function Sum(initVal){
      this.value=initVal;
    }
    Object.assign(Sum.prototype,{
      add(value){
        this.value+=value;
        return this;
      },
      getValue(){
        return this.value;
      }
    });
    let sum0=createNew(bind(Sum,{a:2,value:666},1));
    let sum1=createNew(bind(Sum,{a:2,value:666}),1);
    let sum2=new (Sum.bind({a:2,value:666},1));
    let sum3=new (Sum.bind({a:2,value:666}))(1);
    assert.strictEqual(sum0.a,undefined);
    assert.strictEqual(sum1.a,undefined);
    assert.strictEqual(sum2.a,undefined);
    assert.strictEqual(sum3.a,undefined);
    assert.strictEqual(sum0.getValue(),1);
    assert.strictEqual(sum1.getValue(),1);
    assert.strictEqual(sum2.getValue(),1);
    assert.strictEqual(sum3.getValue(),1);
  });
});
describe('instanceOf()',function(){
  it('Basic test',function(){
    assert.strictEqual(instanceOf([],Array), [] instanceof Array);
  });
});

