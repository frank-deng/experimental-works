export default{
  data(){
    return{
      focus:200,
      waveLength:1
    };
  },
  mounted(){
    let canvas=this.$refs.zonePlateCanvas, container=this.$refs.zonePlateContainer;
    let resizeHandler=()=>{
      canvas.width=container.offsetWidth;
      canvas.height=container.offsetHeight;
    }
    resizeHandler();
    window.addEventListener('resize',resizeHandler);

    let running=true, offset=0;
    let frameHandler=()=>{
      this.drawZonePlate(offset);
      offset-=Math.PI/10;
      if(running){
        requestAnimationFrame(frameHandler);
      }
    }
    this.$once('hook:beforeDestroy',()=>{
      window.removeEventListener('resize',resizeHandler);
      running=false;
    });
    frameHandler();
  },
  methods:{
    drawZonePlate(offsetCos){
      let canvas=this.$refs.zonePlateCanvas;
      let ctx=canvas.getContext('2d');
      let image=ctx.getImageData(0,0,canvas.width,canvas.height);

      let f=this.focus, waveLength=this.waveLength, cx=Math.round(image.width/2), cy=Math.round(image.height/2);
      for(let y=0;y<image.height;y++){
        for(let x=0;x<image.width;x++){
          let offset=(y*canvas.width+x)*4;

          let r2=(x-cx)*(x-cx)+(y-cy)*(y-cy);
          let n=r2/f/waveLength;
          let value=Math.round((Math.cos(n+offsetCos)+1)/2.0*255);
          image.data[offset]=image.data[offset+1]=image.data[offset+2]=value;
          image.data[offset+3]=255;
        }
      }
      ctx.putImageData(image,0,0);
    }
  }
}
