import {analyzeGround, getSteer} from './analyzer.js'
export default{
  components:{
    drawPad:require('./DrawPad.vue').default,
    car:require('./car.vue').default,
  },
  data(){
    return{
      active:true,
      analyzerResult:'',
      navigation:false,
      delay:100,
      placeCar:false,
    };
  },
  watch:{
    navigation(navigation){
      if(!navigation){
        this.$message({
          message: '小车导航丢失',
          type: 'warning'
        });
      }
    },
  },
  methods:{
    clearDrawPad(){
      this.$refs.drawPad.clear();
    },
    enterPlaceCarMode(){
      this.placeCar = true;
    },
    doPlaceCar(x,y){
      if(!this.placeCar){
        return;
      }
      this.$refs.car.place(x,y,0);
      this.placeCar = false;
    },
  },
  mounted(){
    let drawPadCanvas = this.$refs.drawPad.getCanvas();
    this.$refs.car.place(drawPadCanvas.width/2, drawPadCanvas.height/2, 0);
    let processCar=()=>{
      if(!this.active){
        return;
      }
      setTimeout(processCar, this.delay);
      this.$refs.car.nextMove();
      this.$refs.car.lookGround(drawPadCanvas, this.$refs.groundCamera);
      let result = this.analyzerResult = analyzeGround(this.$refs.groundCamera);
      if (null === result[0] || null === result[1]){
        this.$refs.car.setSteer(0);
        this.$refs.car.setSpeed(0);
        this.navigation = false;
      } else {
        this.$refs.car.setSteer(getSteer(result[0], result[1]));
        this.$refs.car.setSpeed(1);
        this.navigation = true;
      }
    };
    processCar();
  },
  beforeRouteLeave(to,from,next){
    this.active = false;
    next();
  },
  beforeDestroy(){
    this.active = false;
  },
}

