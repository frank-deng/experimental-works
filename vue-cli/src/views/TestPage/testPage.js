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
        xAxis:{
          type:'category',
          splitLine:{
            show:true
          },
          data:['A1','A2','A3','A4','A5']
        },
        yAxis:{
          type:'category',
          splitLine:{
            show:true
          },
          data:['1年','2年','3年','4年','5年']
        },
        series:[
          {
            type:'custom',
            xAxisIndex:0,
            yAxisIndex:0,
            data:[
              [0,0,0.1,0],
              [0,2,0.4,1],
              [0,2,0.6,0],
              [0,2,1,0],
            ],
            renderItem(param,api){
              let keyRegion = `${api.value(0)}-${api.value(1)}`;
              let value = api.value(2), type = api.value(3);
              if(!param.context[keyRegion]){
                param.context[keyRegion]=[];
              }
              let valueList = param.context[keyRegion];
              valueList.push(value);

              let data=[api.value(0),api.value(1),value];
              let coord=api.coord(data),size=api.size(data);
              let padding=[12,12];
              let rectWidth = size[0]-padding[0]*2;
              let rectHeight = size[1]-padding[1]*2;

              let x=(valueList.length-1)*12, y=value*rectHeight;

              return{
                type:'group',
                position:[
                  coord[0]-size[0]/2+padding[0],
                  coord[1]-size[1]/2+padding[1]
                ],
                width:size[0]-padding[0]*2,
                height:size[1]-padding[1]*2,
                children:[
                  /*
                  {
                    type:'rect',
                    shape:{
                      x:0,y:0,
                      width:rectWidth,
                      height:rectHeight
                    },
                    style:{
                      fill:'rgba(255,0,255,0.1)'
                    }
                  },
                  */
                  {
                    type:'circle',
                    shape:{
                      cx:x,cy:y,r:6
                    },
                    style:{
                      fill:'rgba(255,0,255,1)'
                    }
                  }
                ]
              };
            }
          }
        ]
      };
      let graph=echarts.init(this.$refs.graphContainer);
      graph.setOption(option);
    }
  }
}

