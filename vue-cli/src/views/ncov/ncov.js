import config from '@/config.js';
import 'echarts/map/js/china.js';
import echarts from 'echarts';
import axios from 'axios';
export default{
  data(){
    return{
      chart:null
    };
  },
  mounted(){
    this.onResize();
    window.addEventListener('resize',this.onResize);
    this.$on('hook:beforeDestroy',()=>{
      window.removeEventListener('resize',this.onResize);
    });
    this.$nextTick(()=>{
      this.loadData();
    });
  },
  methods:{
    onResize(){
      let dom=this.$refs.graphContainer;
      let width=dom.offsetWidth;
      let height=Math.round(width/4*3);
      Object.assign(dom.style,{
        height:height+'px'
      });
      if(this.chart){
        this.$nextTick(()=>{
          this.chart.resize();
        });
      }
    },
    loadData(){
      axios.get('https://api.tianapi.com/txapi/ncovcity/index',{
        params:{
          key:config.key
        }
      }).then((resp)=>{
        if(200!=resp.data.code){
          console.error(resp);
          this.$message.error(resp.data.msg);
          return;
        }
        this.drawGraph(resp.data.newslist);
      });
    },
    drawGraph(respData){
      let option={
        tooltip:{
          trigger:'item'
        },
        series:[
          {
            type:'map',
            mapType:'china',
            gridIndex:0,
            left:10,
            right:10,
            top:10,
            bottom:10,
            data:respData.map((item)=>{
              return{
                name:item.provinceShortName,
                value:item.confirmedCount,
                confirmedCount:item.confirmedCount,
                suspectedCount:item.suspectedCount,
                deadCount:item.deadCount,
                curedCount:item.curedCount
              };
            }),
            tooltip:{
              position:'inside',
              extraCssText:'text-align:left',
              formatter(params){
                let item=params.data;
                return `${item.name}<br/>
                  确诊病例：${item.confirmedCount}<br/>
                  疑似病例：${item.suspectedCount}<br/>
                  治愈病例：${item.curedCount}<br/>
                  死亡病例：${item.deadCount}`;
              }
            }
          }
        ]
      };
      this.chart=echarts.init(this.$refs.graphContainer);
      this.chart.setOption(option);
    }
  }
}
