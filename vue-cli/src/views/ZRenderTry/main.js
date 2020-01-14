import ZRender from 'zrender';
export default{
  data(){
    return{
      zr:null,
      zrItem:null
    };
  },
  mounted(){
    this.zr=ZRender.init(this.$refs.zrContainer,{
      renderer:'svg'
    });
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
        style:{
          text:'666',
          textFill:'#cccccc',
          fontSize:16,
          textVerticalAlign:'middle',
          textLineHeight:30,
          textPosition:[0,0]
        }
      });

      let rect=new ZRender.Rect({
        shape:{
          x:0,
          y:0,
          width:30,
          height:30
        },
        style:{
          fill:'#233333'
        }
      })

      let group=new ZRender.Group({
        position:[0,0],
        cursor:'pointer',
        draggable:true
      });
      group.add(rect);
      group.add(text);
      this.zr.add(group);
      this.zrItem=group;
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

