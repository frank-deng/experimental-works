export default{
  data(){
    return {
      x:0,
      y:0,
      rotation:0,
      speed:1,
      steer:0,
    };
  },
  computed:{
    carStyle(){
      return {
        left:`${this.x}px`,
        top:`${this.y}px`,
        transform:`rotate(${this.rotation}deg)`,
      };
    },
  },
  methods:{
    place(x,y,r=0){
      this.x = x;
      this.y = y;
      this.rotation = r;
    },
    setSpeed(speed){
      this.speed = speed;
    },
    setSteer(steer){
      this.steer = steer;
    },
    nextMove(){
      this.rotation += this.steer;
      this.x += this.speed * Math.sin(Math.PI/180*this.rotation);
      this.y -= this.speed * Math.cos(Math.PI/180*this.rotation);
    },
  },
  mounted(){
  },
}
