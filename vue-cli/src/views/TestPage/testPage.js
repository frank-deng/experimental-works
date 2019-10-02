/* global __DEV__ */
import echarts from 'echarts';
export default{
  data(){
    return{
    };
  },
  mounted(){
    this.drawGraph();

    let size=2048;
    let tatamiPattern=new Image();
    tatamiPattern.src=require('@/assets/tatami.jpg');
    return new Promise((resolve,reject)=>{
      tatamiPattern.addEventListener('load',resolve);
      tatamiPattern.addEventListener('error',reject);
    }).then((e)=>{
      let canvas=this.$refs.drawCanvas;
      canvas.width=canvas.height=size;
      let ctx=canvas.getContext('2d');

      ctx.fillStyle='#332011';
      ctx.fillRect(0,0,size,size);

      let margin=10,baseWidth=Math.round(size/4)-2*margin, baseHeight=Math.round(size/2)-2*margin;
      ctx.drawImage(tatamiPattern,
        margin,margin,
        baseWidth,baseHeight);
      ctx.drawImage(tatamiPattern,
        margin,Math.round(size/2)+margin,
        baseWidth,baseHeight);

      ctx.drawImage(tatamiPattern,
        Math.round(size*3/4)+margin,margin,
        baseWidth,baseHeight);
      ctx.drawImage(tatamiPattern,
        Math.round(size*3/4)+margin,Math.round(size/2)+margin,
        baseWidth,baseHeight);

      ctx.drawImage(tatamiPattern,
        Math.round(size/4)+margin,Math.round(size/4)+margin,
        baseWidth,baseHeight);
      ctx.drawImage(tatamiPattern,
        Math.round(size/2)+margin,Math.round(size/4)+margin,
        baseWidth,baseHeight);

      ctx.save();
      ctx.translate(canvas.width/2,canvas.height/2);
      ctx.rotate(Math.PI/2);

      ctx.drawImage(tatamiPattern,
        Math.round(size/4)+margin,-Math.round(size/4)+margin,
        baseWidth,baseHeight);
      ctx.drawImage(tatamiPattern,
        -Math.round(size/2)+margin,-Math.round(size/4)+margin,
        baseWidth,baseHeight);
      ctx.restore();
    }).catch((e)=>{
      this.$alert(e,{type:'error'});
      console.error(e);
    });
  },
  methods:{
    drawGraph(){
      if(!this.$refs.graphContainer){
        return;
      }
      let option={
        silent:true,
        animation:false,
        title:{
          text:'测试图表'
        }
      };
      let graph=echarts.init(this.$refs.graphContainer);
      graph.setOption(option);
    }
  }
}

