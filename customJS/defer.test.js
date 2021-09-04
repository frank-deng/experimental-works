const Defer=require('./defer');
function looper(i=0){
  return new Defer((resolve,reject)=>{
    setTimeout(()=>{
      resolve(i+1);
    },500);
  }).then((n)=>{
    console.log(n);
    return n+1;
  }).then((n)=>{
    console.log(n);
    return new Defer((next)=>{
      setTimeout(()=>next(n+1),2000);
    });
  }).then((n)=>{
    console.log(n);
    looper(n);
  }).error(e=>{
    console.error(e);
  });
}
looper();

