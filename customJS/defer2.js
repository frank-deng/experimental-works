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
  this.thenHandler=null;
  this.errorHandler=null;
  this.thenResolve=null;
  this.errorReject=null;
  let nextFunc=bind(function(){
    this._next();
  },this);
  let _this=this;
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
    try{
      if(Defer.STAT_RESOLVED==this.state && this.thenHandler){
        let handlerRet=this.thenHandler(this.ret);
        if('object'==typeof(handlerRet) && instanceOf(handlerRet,Defer)){
          handlerRet.then(this.thenResolve,this.errorHandler);
        }else{
          this.thenResolve(handlerRet);
        }
      }else if(Defer.STAT_ERROR==this.state){
        if(this.errorHandler){
          this.errorHandler(this.ret);
        }
        this.errorReject(this.ret);
      }
    }catch(e){
      console.error(e);
      if(this.errorReject){
        this.errorReject(e);
      }
    }
  },
  then(handler,errorHandler){
    let _this=this;
    return new Defer(function(resolve,reject){
      _this.thenHandler=handler;
      _this.thenResolve=resolve;
      _this.errorHandler=errorHandler;
      _this.errorReject=reject;
      if(_this.state){
        _this._next();
      }
    });
  },
  catch(handler){
    return this.then(null,handler);
  }
}
module.exports=Defer;

