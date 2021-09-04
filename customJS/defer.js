const {
  bind,
  instanceOf
}=require('./index');
function Defer(handler){
  if('function'!==typeof(handler)){
    throw TypeError('handler function required');
  }
  this.state=null;
  this.ret=null;
  this.thenHandler=[];
  this.errorHandler=[];
  let _this=this;
  let nextFunc=bind(function(){
    this._next();
  },this);
  try{
    handler(function(ret){
      _this.state=Defer.STAT_RESOLVED;
      _this.ret=ret;
      process.nextTick(nextFunc);
    },function(e){
      _this.state=Defer.STAT_ERROR;
      _this.ret=e;
      process.nextTick(nextFunc);
    });
  }catch(e){
    _this.state=Defer.STAT_ERROR;
    _this.ret=e;
    process.nextTick(nextFunc);
  }
}
//准备一些静态变量
Object.assign(Defer,{
  STAT_RESOLVED:Symbol('resolved'),
  STAT_ERROR:Symbol('error'),
});
Defer.prototype={
  constructor:Defer,
  _next(){
    let nextHandler=null;
    while(true){
      let hander=null;
      if(Defer.STAT_RESOLVED===this.state){
        handler=this.thenHandler.shift();
      } else if(Defer.STAT_ERROR===this.state){
        handler=this.errorHandler.shift();
      }
      if(!handler){
        return this;
      }
      try{
        this.ret=handler(this.ret);
      }catch(e){
        console.error(e);
        this.state=Defer.STAT_ERROR;
        this.ret=e;
        continue;
      }
      if('object'==typeof(this.ret) && instanceOf(this.ret,Defer)){
        nextHandler=this.ret;
        break;
      }
    }
    if(!nextHandler){
      return this;
    }
    while(this.thenHandler.length || this.errorHandler.length){
      nextHandler=nextHandler.then(
        this.thenHandler.shift(),
        this.errorHandler.shift()
      );
    }
    return nextHandler;
  },
  then(handler,errorHandler){
    if('function'==typeof(handler)){
      this.thenHandler.push(handler);
    }
    if('function'==typeof(errorHandler)){
      this.errorHandler.push(handler);
    }
    return this.state ? this._next() : this;
  },
  catch(handler){
    return this.then(null,handler);
  }
}
module.exports=Defer;

