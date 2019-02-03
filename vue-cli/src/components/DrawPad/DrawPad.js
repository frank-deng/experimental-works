export default{
  props:{
    width:Number,
    height:Number,
  },
  data(){
    return{
      drawing:false,
      ctx:undefined,
      x0:undefined,
      y0:undefined,
    };
  },
  watch:{
    drawing(drawing){
      if(!drawing){
        this.x0 = this.y0 = undefined;
      }
    },
  },
  methods:{
    clear(){
      let drawPad = this.$refs.drawPad;
      let ctx = this.ctx;
      ctx.clearRect(0,0,drawPad.width,drawPad.height);
      this.drawing=false;
    },
    getCanvas(){
      return this.$refs.drawPad;
    },
  },
  mounted(){
    let drawPad = this.$refs.drawPad;
    this.ctx = drawPad.getContext('2d');
    let drawLine=(x,y)=>{
      if(!this.ctx || !this.drawing){
        return;
      }

      if(undefined !== this.x0 && undefined !== this.y0){
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(this.x0, this.y0);
        ctx.lineTo(x,y);
        ctx.stroke();
      }

      this.x0 = x;
      this.y0 = y;
    }

    drawPad.addEventListener('mousedown',(e)=>{
      this.drawing=true;
    });
    drawPad.addEventListener('mouseup',(e)=>{
      this.drawing=false;
    });
    drawPad.addEventListener('mousemove',(e)=>{
      drawLine(e.offsetX,e.offsetY);
    });
    drawPad.addEventListener('touchstart',(e)=>{
      this.drawing=true;
    });
    drawPad.addEventListener('touchend',(e)=>{
      if(0 == e.touches.length){
        this.drawing=false;
      }
    });
    drawPad.addEventListener('touchmove',(e)=>{
      let rect = drawPad.getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left;
      let y = e.touches[0].clientY - rect.top;
      drawLine(x,y);
    });
  },
}
