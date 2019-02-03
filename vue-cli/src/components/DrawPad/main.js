export default{
  components:{
    drawPad:require('./DrawPad.vue').default,
    car:require('./car.vue').default,
  },
  methods:{
    clearDrawPad(){
      this.$refs.drawPad.clear();
    },
  },
  mounted(){
    this.$refs.car.place(200,100,0);
    this.$refs.car.setSpeed(1);
    this.$refs.car.setSteer(-1);

    let ctxGroundCameraCrop = this.$refs.groundCameraCrop.getContext('2d');
    setInterval(()=>{
      this.$refs.car.nextMove();
      this.$refs.car.lookGround(this.$refs.drawPad.getCanvas(), this.$refs.groundCamera);
      ctxGroundCameraCrop.clearRect(0,0,100,100);
      ctxGroundCameraCrop.drawImage(this.$refs.groundCamera, -16, -16);
    },100)
  },
}
