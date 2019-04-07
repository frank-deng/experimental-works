import {
  drawOutlineFont,
} from './drawOutlineFont.js';
export default{
  props:{
    fontData:null,
    width:{
      type:Number,
      default:170,
    },
    height:{
      type:Number,
      default:170,
    },
    x:{
      type:Number,
      default:0,
    },
    y:{
      type:Number,
      default:0,
    },
  },
  data(){
    return{
      range:null,
    };
  },
  watch:{
    fontData:{
      immediate:true,
      handler(fontData){
        if(!fontData){
          return;
        }
        this.update();
      },
    },
    width(){
      this.update();
    },
    height(){
      this.update();
    },
    x(){
      this.update();
    },
    y(){
      this.update();
    },
  },
  methods:{
    update(){
      this.$nextTick(()=>{
        let canvas=this.$refs.preview;
        let ctx=canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let image=ctx.getImageData(0,0,canvas.width,canvas.height);
        this.range=drawOutlineFont(image,this.x,this.y,this.width,this.height,this.fontData);
        ctx.putImageData(image,0,0);
      })
    },
  },
}
