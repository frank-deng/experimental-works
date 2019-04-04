var jumpStep=[
  4,2,2,4,
  8,12,8,3,
  3,2,3,4,
  6,6,9,4
];
export default{
  props:{
    fontData:null,
  },
  data(){
    return{
      fontDataExtract:null,
      missingHalfBytes:'-',
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
        this.check(fontDataExtract);
      },
    },
  },
  methods:{
    check(fontData){
      if(!(fontData instanceof Uint8Array)){
        console.error('无效数据',formData);
        return;
      }
      //检测步长是否正确
      let offset=0, times=fontData.length*2;
      while(offset<fontData.length && --times){
        let oper=fontData[offset];
        offset+=jumpStep[oper]+1;
      }
      if(0==times){
        console.error('死循环');
      }else{
        this.missingHalfBytes=(offset-fontData.length);
      }
    },
  },
}