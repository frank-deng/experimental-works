const fs=require('fs');
let content=fs.readFileSync(process.argv[2]).toString();

let xbmData=(/\{([\s\S]*)\}/gm.exec(content)[1]).split(',').map((item)=>{
  return Number(item.trim());
});

let rotateBits8=function(num){
  let result=0;
  for(let i=0;i<8;i++){
    result|=((num&(0x80>>i))?1:0)<<i;
  }
  return result;
}
let getIcon=function(src){
  let result=[
    new Array(32),
    new Array(32),
  ];
  for(let y=0;y<32;y++){
    let v0=src[4*y], v1=src[4*y+1], v2=src[4*y+2], v3=src[4*y+3];
    v0=rotateBits8(v0);
    v1=rotateBits8(v1);
    v2=rotateBits8(v2);
    v3=rotateBits8(v3);
    result[0][y]=(v0<<8)|v1;
    result[1][y]=(v2<<8)|v3;
  }
  return result;
}
let output={
  width:32,height:32,data:getIcon(xbmData),
}
console.log(JSON.stringify(output,null,2));