const Defer=require('./defer');
function looper(i=0){
  return new Defer((resolve,reject)=>{
    resolve(i+1);
  }).then((n)=>{
    console.log(n);
    return looper(n);
  }).error(e=>{
    console.error(e);
  });
}
looper();

