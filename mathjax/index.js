const processDocument=require('./processor');
const fs=require('fs');
const rimraf=require('rimraf');

let config={
  "source":"_posts",
  "sourceEncoding":"UTF-8",
  "targetEncoding":"GB2312",
  "target":"dist",
  "imageDir":"images",
  "equationDir":"equation"
};

async function getMasterConfig(){
  let configFile=await new Promise((resolve,reject)=>{
    fs.readFile(`${__dirname}/config.json`,'UTF-8',(e,data)=>(e?reject(e):resolve(data)));
  });
  Object.assign(config,JSON.parse(configFile));
  return config;
}
async function processPost(name){
  //Read post-specified config
  let [localConfig,content]=await Promise.all([
    new Promise((resolve,reject)=>{
      let path=`${__dirname}/${config.source}/${name}.json`;
      fs.exists(path,(exists)=>{
        if(!exists){
          resolve({});return;
        }
        fs.readFile(path,config.sourceEncoding,(e,data)=>{
          if(e){
            reject(e);
          }
          try{
            resolve(JSON.parse(data));
          }catch(e){
            console.error(e);
            resolve({});
          }
        });
      });
    }),
    new Promise((resolve,reject)=>{
      fs.readFile(`${__dirname}/${config.source}/${name}.md`,config.sourceEncoding,(e,data)=>(e?reject(e):resolve(data)));
    })
  ]);

  let template=(localConfig.layout || config.layout);
  if(template){
    template=__dirname+'/'+template;
  }

  let result=await processDocument(content,{
    imagePrefix:config.equationDir+'/',
    targetEncoding:config.targetEncoding,
    template,
    title: (localConfig.title || name),
    scale: (localConfig.scale || config.scale)
  });

  //Write to the target
  let target=config.target;
  await Promise.all([
    new Promise((resolve,reject)=>{
      fs.writeFile(target+`/${name}.htm`,result.html,'binary',(e)=>(e?reject(e):resolve(e)));
    }),
    ...result.image.map(item=>new Promise((resolve,reject)=>{
      fs.writeFile(target+'/'+item.path,item.data,'binary',(e)=>(e?reject(e):resolve(e)));
    }))
  ]);

  //Output title
  return {
    title:(localConfig.title || name)
  };
}
async function main(){
  //Get master config
  getMasterConfig();
  let target=config.target;

  //Clear and recreate destination folder structure
  await new Promise((r)=>{
    rimraf(target,r);
  });
  await Promise.all([
    new Promise((resolve,reject)=>{
      fs.mkdir(target+'/'+config.imageDir,{
        recursive:true
      },(e)=>(e?reject(e):resolve(e)));
    }),
    new Promise((resolve,reject)=>{
      fs.mkdir(target+'/'+config.equationDir,{
        recursive:true
      },(e)=>(e?reject(e):resolve(e)));
    })
  ]);

  //Get all the posts
  let posts = await new Promise((resolve,reject)=>{
    fs.readdir(__dirname+'/'+config.source,(err,files)=>{
      if(err){
        reject(err);
      }
      resolve(
        files.filter(file=>'md'==file.split('.').pop()).map(file=>{
          let fileSplit=file.split('.');
          return fileSplit.slice(0,fileSplit.length-1).join('.');
        })
      );
    });
  });

  //Process all the posts
  await Promise.all(posts.map(postName=>processPost(postName)));
}

try{
  main().catch((e)=>{
    console.error(e);
  });
}catch(e){
  console.error(e);
}

