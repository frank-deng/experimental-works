import {analyzeGround, getSteer} from './analyzer.js'
export default{
  components:{
    drawPad:require('./DrawPad.vue').default,
    car:require('./car.vue').default,
  },
  data(){
    return{
      analyzerResult:'',
    };
  },
  methods:{
    clearDrawPad(){
      this.$refs.drawPad.clear();
    },
  },
  mounted(){
    this.$refs.car.place(200,100,0);
    setInterval(()=>{
      this.$refs.car.nextMove();
      this.$refs.car.lookGround(this.$refs.drawPad.getCanvas(), this.$refs.groundCamera);
      let result = this.analyzerResult = analyzeGround(this.$refs.groundCamera);
      if (null === result[0] || null === result[1]){
        this.$refs.car.setSteer(0);
        this.$refs.car.setSpeed(0);
      } else {
        this.$refs.car.setSteer(getSteer(result[0], result[1]));
        this.$refs.car.setSpeed(1);
      }
    },100);
  },
}
