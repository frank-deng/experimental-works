import iconv from 'iconv-lite';
const jumpStep=[
  4,2,2,4,
  8,12,8,3,
  3,2,3,4,
  6,6,9,4
];
var parseParam=function(oper,buffer){
  return ([
    //0
    (data)=>{
      return{
        x1:(data[0]<<4)|data[1],
        y1:(data[2]<<4)|data[3],
      };
    },
    //1
    (data)=>{
      return{
        x1:(data[0]<<4)|data[1],
      };
    },
    //2
    (data)=>{
      return{
        y1:(data[0]<<4)|data[1],
      };
    },
    //3
    (data)=>{
      return{
        x1:(data[0]<<4)|data[1],
        y1:(data[2]<<4)|data[3],
      };
    },
    //4
    (data)=>{
      return{
        x1:(data[0]<<4)|data[1],
        y1:(data[2]<<4)|data[3],
        x2:(data[4]<<4)|data[5],
        y2:(data[6]<<4)|data[7],
      };
    },
    //5
    (data)=>{
      return{
        x1:(data[0]<<4)|data[1],
        y1:(data[2]<<4)|data[3],
        x2:(data[4]<<4)|data[5],
        y2:(data[6]<<4)|data[7],
        x3:(data[8]<<4)|data[9],
        y3:(data[10]<<4)|data[11],
      };
    },
    //6
    (data)=>{
      return{
        x1:(data[0]<<4)|data[1],
        y1:(data[2]<<4)|data[3],
        x2:(data[4]<<4)|data[5],
        y2:(data[6]<<4)|data[7],
      };
    },
    //7
    (data)=>{
      let dx=data[0]&0x7;
      return{
        dx1:(0x8&data[0]?-dx:dx),
        y1:(data[1]<<4)|data[2],
      };
    },
    //8
    (data)=>{
      let dy=data[2]&0x7;
      return{
        x1:(data[0]<<4)|data[1],
        dy1:(0x8&data[2]?-dy:dy),
      };
    },
    //9
    (data)=>{
      let dx=data[0]&0x7, dy=data[1]&0x7;
      return{
        dx1:(0x8&data[0]?-dx:dx),
        dy1:(0x8&data[1]?-dy:dy),
      };
    },
    //10
    (data)=>{
      let dx=(data[0]<<2)|(data[1]>>2);
      let dy=((data[1]&0x3)<<4)|data[2];
      return{
        dx1:(32&dx?-(dx&31):(dx&31)),
        dy1:(32&dy?-(dy&31):(dy&31)),
      };
    },
    //11
    (data)=>{
      let dx1=data[0],dy1=data[1],dx2=data[2],dy2=data[3];
      return{
        dx1:(8&dx1?-(dx1&7):(dx1&7)),
        dy1:(8&dy1?-(dy1&7):(dy1&7)),
        dx2:(8&dx2?-(dx2&7):(dx2&7)),
        dy2:(8&dy2?-(dy2&7):(dy2&7)),
      };
    },
    //12
    (data)=>{
      let dx1=(data[0]<<2)|(data[1]>>2);
      let dy1=((data[1]&0x3)<<4)|data[2];
      let dx2=(data[3]<<2)|(data[4]>>2);
      let dy2=((data[4]&0x3)<<4)|data[5];
      return{
        dx1:(32&dx1?-(dx1&31):(dx1&31)),
        dy1:(32&dy1?-(dy1&31):(dy1&31)),
        dx2:(32&dx2?-(dx2&31):(dx2&31)),
        dy2:(32&dy2?-(dy2&31):(dy2&31)),
      };
    },
    //13
    (data)=>{
      let dx1=data[0],dy1=data[1],dx2=data[2],dy2=data[3],dx3=data[4],dy3=data[5];
      return{
        dx1:(8&dx1?-(dx1&7):(dx1&7)),
        dy1:(8&dy1?-(dy1&7):(dy1&7)),
        dx2:(8&dx2?-(dx2&7):(dx2&7)),
        dy2:(8&dy2?-(dy2&7):(dy2&7)),
        dx3:(8&dx3?-(dx3&7):(dx3&7)),
        dy3:(8&dy3?-(dy3&7):(dy3&7)),
      };
    },
    //14
    (data)=>{
      let dx1=(data[0]<<2)|(data[1]>>2);
      let dy1=((data[1]&0x3)<<4)|data[2];
      let dx2=(data[3]<<2)|(data[4]>>2);
      let dy2=((data[4]&0x3)<<4)|data[5];
      let dx3=(data[6]<<2)|(data[7]>>2);
      let dy3=((data[7]&0x3)<<4)|data[8];
      return{
        dx1:(32&dx1?-(dx1&31):(dx1&31)),
        dy1:(32&dy1?-(dy1&31):(dy1&31)),
        dx2:(32&dx2?-(dx2&31):(dx2&31)),
        dy2:(32&dy2?-(dy2&31):(dy2&31)),
        dx3:(32&dx3?-(dx3&31):(dx3&31)),
        dy3:(32&dy3?-(dy3&31):(dy3&31)),
      };
    },
    //15
    (data)=>{
    },
  ])[oper](buffer);
}
var processFontData=function(buffer){
  //Extract font data
  let fontData=new Uint8Array(buffer.length*2), i=0;
  for(let n of buffer){
    fontData[i]=n&0xf;
    i++;
    fontData[i]=n>>4;
    i++;
  }

  //Parse font data
  let offset=0, steps=[];
  while(offset<fontData.length){
    let oper=fontData[offset];
    if(0==oper && offset==(fontData.length-1)){
      offset++;
      break;
    }
    steps.push({
      oper:oper,
      param:parseParam(oper,fontData.slice(offset+1,offset+jumpStep[oper]+1)),
    });
    offset+=jumpStep[oper]+1;
  }
  if(offset-fontData.length){
    throw new Error('无效字符轮廓数据');
  }

  return steps;
}
export function loadASCPS(arrayBuffer){
  let fontCount=10,fontData=[],dataView=new DataView(arrayBuffer);
  for(let fontIdx=0;fontIdx<fontCount;fontIdx++){
    let fontDataCur={};
    for(let ch=33;ch<=0x7e;ch++){
      let offset=(fontIdx*94+(ch-33))*6;
      let dataOffset=(dataView.getInt32(offset,true)&0xfffffff);
      let dataLength=dataView.getUint16(offset+4,true);
      fontDataCur[ch.toString(16)]=processFontData(new Uint8Array(arrayBuffer,dataOffset,dataLength));
    }
    fontData.push(fontDataCur);
  }
  return fontData;
}
export function loadHZKPST(arrayBuffer){
  let fontData={},dataView=new DataView(arrayBuffer);
  for(let qu=0xa1;qu<=0xa9;qu++){
    for(let wei=0xa1;wei<=0xfe;wei++){
      let charCodeStr = iconv.decode([qu,wei],'gbk').charCodeAt(0).toString(16);
      let offset=((qu-0xa1)*94+(wei-0xa1))*6;
      let dataOffset=(dataView.getInt32(offset,true)&0xfffffff);
      let dataLength=dataView.getUint16(offset+4,true);
      if(!dataLength){
        fontData[charCodeStr]=null;
        continue;
      }
      try{
        fontData[charCodeStr]=processFontData(new Uint8Array(arrayBuffer,dataOffset,dataLength));
      }catch(e){
        console.error('Character:', charCodeStr, e);
      }
    }
  }
  return fontData;
}
export function loadHZKPS(arrayBuffer){
  let fontData={},dataView=new DataView(arrayBuffer);
  for(let qu=0xb0;qu<=0xf7;qu++){
    for(let wei=0xa1;wei<=0xfe;wei++){
      let charCodeStr = iconv.decode([qu,wei],'gbk').charCodeAt(0).toString(16);
      let offset=((qu-0xb0)*94+(wei-0xa1))*6;
      let dataOffset=(dataView.getInt32(offset,true)&0xfffffff);
      let dataLength=dataView.getUint16(offset+4,true);
      if(!dataLength){
        fontData[charCodeStr]=null;
        continue;
      }
      try{
        fontData[charCodeStr]=processFontData(new Uint8Array(arrayBuffer,dataOffset,dataLength));
      }catch(e){
        console.error('Character:', charCodeStr, e);
      }
    }
  }
  return fontData;
}
