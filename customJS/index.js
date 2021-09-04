function createNew(){
  let constructor=arguments[0];
  if('function'!==typeof(constructor)){
    throw TypeError('Function is required');
  }
  let args=[];
  for(let i=1; i<arguments.length; i++){
    args.push(arguments[i]);
  }

  let targetObj={};
  targetObj.__proto__=constructor.prototype;
  let result=apply(constructor,targetObj,args);
  if('object'===typeof(result)){
    return result;
  }
  return targetObj;
}
function apply(func,target,args){
  if('function'!==typeof(func)){
    throw TypeError('Function is required');
  }
  let ctx={};
  try{
    ctx=target||global;
  }catch(e){}
  if(undefined===args){
    args=[];
  }else if(!Array.isArray(args)){
    throw TypeError('array required as parameters');
  }
  //要给目标对象加上个key，key为随机值，值为目标函数
  let key=String(Math.random());
  ctx[key]=func;
  let result=ctx[key](...args);
  delete ctx[key];
  return result;
}
function call(){
  let func=arguments[0], target=arguments[1];
  if('function'!==typeof(constructor)){
    throw TypeError('Function is required');
  }
  let args=[];
  for(let i=2; i<arguments.length; i++){
    args.push(arguments[i]);
  }
  if('function'!==typeof(func)){
    throw TypeError('Function is required');
  }
  let ctx={};
  try{
    ctx=target||global;
  }catch(e){}
  //要给目标对象加上个key，key为随机值，值为目标函数
  let key=String(Math.random());
  ctx[key]=func;
  let result=ctx[key](...args);
  delete ctx[key];
  return result;
}
function bind(){
  let func=arguments[0], target=arguments[1];
  if('function'!==typeof(func)){
    throw TypeError('Function is required');
  }
  try{
    target=target||global;
  }catch(e){
    target={};
  }
  let args=[];
  for(let i=2; i<arguments.length; i++){
    args.push(arguments[i]);
  }
  //这边出现闭包了
  return function F(){
    if(!instanceOf(this,F)){
      return apply(func,target,args);
    }
    return createNew(func,...args,...arguments);
  }
}
function instanceOf(left,right){
  if('object'!==typeof(left) && 'function'!==typeof(left)){
    throw TypeError('left hand object required');
  }
  if('object'!==typeof(right) && 'function'!==typeof(right)){
    throw TypeError('right hand object required');
  }
  let target=right.prototype;
  left=left.__proto__;
  while(left){
    if(left===target){
      return true;
    }
    left=left.__proto__;
  }
  return false;
}
module.exports={
  createNew,
  apply,
  call,
  bind,
  instanceOf
};

