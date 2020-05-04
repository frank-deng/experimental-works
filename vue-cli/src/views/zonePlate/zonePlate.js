export default{
  data(){
    return{
    };
  },
  mounted(){
    this.drawZonePlate();
  },
  methods:{
    drawZonePlate(){
      let canvas=this.$refs.zonePlateCanvas;
      let ctx=canvas.getContext('2d');
      let image=ctx.getImageData(0,0,canvas.width,canvas.height);

      let f=10, cx=Math.round(image.width/2), cy=Math.round(image.height/2);
      for(let y=0;y<image.height;y++){
        for(let x=0;x<image.width;x++){
          let offset=(y*canvas.width+x)*4;

          let r2=(x-cx)*(x-cx)+(y-cy)*(y-cy);
          let l=Math.sqrt(f*f+r2);
          let value=Math.round(Math.cos(l)*255);
          image.data[offset]=image.data[offset+1]=image.data[offset+2]=value;
          image.data[offset+3]=255;
        }
      }
      ctx.putImageData(image,0,0);
    }
  }
}
