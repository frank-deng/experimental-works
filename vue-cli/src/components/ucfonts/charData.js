import {
  drawOutlineFont,
} from './drawOutlineFont.js';
export default{
  props:{
    fontData:null,
    width:{
      type:Number,
      default:100,
    },
    height:{
      type:Number,
      default:100,
    },
  },
  data(){
    return{
      fontDataExtract:null,
      steps:'-',
      lines:null,
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
        if(!fontData){
          return;
        }
        this.$nextTick(()=>{
          let canvas=this.$refs.preview;
          let ctx=canvas.getContext('2d');
          ctx.clearRect(0,0,canvas.width,canvas.height);
          let image=ctx.getImageData(0,0,canvas.width,canvas.height);
          drawOutlineFont(image,0,0,this.width,this.height,fontData);
          ctx.putImageData(image,0,0);
        })
      },
    },
  },
  methods:{
  },
}
