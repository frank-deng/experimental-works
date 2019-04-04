var jumpStep=[
  4,2,2,4,
  8,12,8,3,
  3,2,3,4,
  6,6,9,4
];
var paramParser=[
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
    };
  },
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
    };
  },
  (data)=>{
    return{
      y1:(data[0]<<4)|data[1],
    };
  },
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
    };
  },
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
      x2:(data[4]<<4)|data[5],
      y2:(data[6]<<4)|data[7],
    };
  },
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
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
      x2:(data[4]<<4)|data[5],
      y2:(data[6]<<4)|data[7],
    };
  },
  (data)=>{
    let dx=data[0]&0x7;
    return{
      dx1:(0x8&data[0]?-dx:dx),
      y1:(data[1]<<4)|data[2],
    };
  },
  (data)=>{
    let dy=data[2]&0x7;
    return{
      x1:(data[0]<<4)|data[1],
      dy1:(0x8&data[2]?-dy:dy),
    };
  },
  (data)=>{
    let dx=data[0]&0x7, dy=data[1]&0x7;
    return{
      dx1:(0x8&data[0]?-dx:dx),
      dy1:(0x8&data[1]?-dy:dy),
    };
  },
  (data)=>{
    let dx=(data[0]<<2)|(data[1]>>2);
    let dy=((data[1]&0x3)<<4)|data[2];
    return{
      dx1:(32&dx?-(dx&31):(dx&31)),
      dy1:(32&dy?-(dy&31):(dy&31)),
    };
  },
  (data)=>{
    let dx1=data[0],dy1=data[1],dx2=data[2],dy2=data[3];
    return{
      dx1:(8&dx1?-(dx1&7):(dx1&7)),
      dy1:(8&dy1?-(dy1&7):(dy1&7)),
      dx2:(8&dx2?-(dx2&7):(dx2&7)),
      dy2:(8&dy2?-(dy2&7):(dy2&7)),
    };
  },
  (data)=>{
  },
  (data)=>{
    let dx1=data[0],dy1=data[1],dx2=data[2],dy2=data[3],dx3=data[4],dy3=data[5];
    return{
      dx1:(8&dx1?-(dx1&7):(dx1&7)),
      dy1:(8&dy1?-(dy1&7):(dy1&7)),
      dx2:(8&dx2?-(dx2&7):(dx2&7)),
      dy2:(8&dy2?-(dy2&7):(dy2&7)),
      dx3:(8&dx3?-(dx3&7):(dx3&7)),
      dye:(8&dy3?-(dy3&7):(dy3&7)),
    };
  },
  (data)=>{
  },
  (data)=>{
  },
];
export default{
  props:{
    fontData:null,
  },
  data(){
    return{
      fontDataExtract:null,
      steps:'-',
    };
  },
  computed:{
    fontDataDisplay(){
      if(!(this.fontDataExtract instanceof Uint8Array)){
        return '无数据';
      }
      return this.fontDataExtract.map((n)=>{
        return n.toString(16);
      }).join('');
    },
    fontDataLen(){
      if(!(this.fontDataExtract instanceof Uint8Array)){
        return '无数据';
      }
      return this.fontDataExtract.length;
    },
  },
  watch:{
    fontData:{
      immediate:true,
      handler(fontData){
        if(!(fontData instanceof Uint8Array)){
          this.fontDataExtract=null;
          return;
        }
        let fontDataExtract=new Uint8Array(fontData.length*2);
        let i=0;
        for(let n of fontData){
          fontDataExtract[i]=n&0xf;
          i++;
          fontDataExtract[i]=n>>4;
          i++;
        }
        this.fontDataExtract=fontDataExtract;
        this.steps=this.check(fontDataExtract);
      },
    },
  },
  methods:{
    check(fontData){
      let offset=0, steps=[];
      while(offset<fontData.length){
        let oper=fontData[offset];
        if(0==oper && offset==(fontData.length-1)){
          offset++;
          break;
        }
        let paramData=fontData.slice(offset+1,offset+jumpStep[oper]+1);
        if(paramParser[oper]){
          paramData=paramParser[oper](paramData);
        }
        steps.push({
          oper:oper,
          param:paramData,
        });
        offset+=jumpStep[oper]+1;
      }
      if(offset-fontData.length){
        throw new Error('无效字符轮廓数据');
      }
      return steps;
    },
  },
}