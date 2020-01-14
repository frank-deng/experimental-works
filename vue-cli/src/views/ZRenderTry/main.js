import ZRender from 'zrender';
export default{
  data(){
    return{
      zr:null,
      zrItem:null
    };
  },
  mounted(){
    this.zr=ZRender.init(this.$refs.zrContainer);
    this.draw();
  },
  beforeDestroy(){
    if(this.zr){
      ZRender.dispose(this.zr);
    }
  },
  methods:{
    draw(){
      let text=new ZRender.Text({
        position:[6,6],
        style:{
          text:'666'
        },
        cursor:'pointer',
        draggable:true
      });
      this.zr.add(text);
      this.zrItem=text;
    },
    animate(){
      this.zrItem.animate('position',false).when(1000,[75,115]).start();
    },
    glitch(){
      let canvas=this.zr.dom.querySelector('canvas');
      let ctx=canvas.getContext('2d');
      ctx.fillStyle='#ff0000';
      ctx.fillRect(130,160,240,400);
    }
  }
}

