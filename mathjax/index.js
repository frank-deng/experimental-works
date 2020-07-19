const processDocument=require('./processor');
const fs=require('fs');
const rimraf=require('rimraf');

//Clear target directory
let target='/dist';
async main(){
  await new Promise((r)=>{
    rimraf(`${__dirname}${target}`,r);
  });

  var content=fs.readFileSync('test.md','UTF-8');
  processDocument(content,{
    imagePrefix:'equation/'
  }).then((result)=>{
    console.log(result);
  }).catch((e)=>{
    console.error(e);
  });
}

main();
