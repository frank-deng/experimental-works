function Defer(handler){
  if('function'!==typeof(handler)){
    throw new TypeError('handler function required');
  }
  this.resolved=false;
  try{
    let _this=this;
    handler(function(param){
      _this.resolved=true;
      if(_this.thenHandler){
        _this.thenHandler(param);
      }
    },function(e){
      _this.resolved='error';
      if(this.errorHandler){
        this.errorHandler(e);
      }
    });
  }catch(e){
    _this.resolved='error';
    if(this.errorHandler){
      this.errorHandler(e);
    }
  }
}
Defer.prototype={
  constructor:Defer,
  then(handler){
    if('function'!==typeof(handler)){
      throw new TypeError('handler function required');
    }
    this.thenHandler=handler;
    return new Defer(function(resolve,reject){
    });
  }
  error(handler){
    if('function'!==typeof(handler)){
      throw new TypeError('handler function required');
    }
    this.errorHandler=handler;
    return this;
  }
}
module.exports=Defer;
