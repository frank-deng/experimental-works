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