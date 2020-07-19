const processDocument=require('./processor');
const fs=require('fs');
const rimraf=require('rimraf');

//Clear target directory
let target=`${__dirname}/dist`;
async function main(){
  await new Promise((r)=>{
    rimraf(target,r);
  });
  await Promise.all([
    new Promise((resolve,reject)=>{
      fs.mkdir(target+'/images',{
        recursive:true
      },(e)=>(e?reject(e):resolve(e)));
    }),
    new Promise((resolve,reject)=>{
      fs.mkdir(target+'/equation',{
        recursive:true
      },(e)=>(e?reject(e):resolve(e)));
    })
  ]);

  let content=await new Promise((resolve,reject)=>{
    fs.readFile('test.md','UTF-8',(e,data)=>(e?reject(e):resolve(data)));
  });
  let result=await processDocument(content,{
    imagePrefix:'equation/'
  });
  await Promise.all([
    new Promise((resolve,reject)=>{
      fs.writeFile(target+'/test.htm',result.html,'utf-8',(e)=>(e?reject(e):resolve(e)));
    }),
    ...result.image.map(item=>new Promise((resolve,reject)=>{
      fs.writeFile(target+'/'+item.path,item.data,'binary',(e)=>(e?reject(e):resolve(e)));
    }))
  ]);
}

try{
  main().catch((e)=>{
    console.error(e);
  });
}catch(e){
  console.error(e);
}
