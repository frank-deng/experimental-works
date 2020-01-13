import ZRender from 'zrender';
export default{
  data(){
    return{
      zr:null
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
        }
      });
      this.zr.add(text);
    }
  }
}

