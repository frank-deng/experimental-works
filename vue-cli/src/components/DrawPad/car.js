export default{
  data(){
    return {
      x:0,
      y:0,
      rotation:0,
      speed:1,
      steer:0,
      captureDistance:40,
    };
  },
  computed:{
    carStyle(){
      return{
        left:`${this.x}px`,
        top:`${this.y}px`,
        transform:`rotate(${this.rotation}deg)`,
      };
    },
    cameraStyle(){
      let captX = this.x + this.captureDistance * Math.sin(Math.PI/180*this.rotation);
      let captY = this.y - this.captureDistance * Math.cos(Math.PI/180*this.rotation);
      return{
        marginTop:`${-this.captureDistance}px`,
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
    lookGround(ground,camera){
      let captX = this.x + this.captureDistance * Math.sin(Math.PI/180*this.rotation);
      let captY = this.y - this.captureDistance * Math.cos(Math.PI/180*this.rotation);
      let camW = camera.width, camH = camera.height;
      let ctxCamera = camera.getContext('2d');
      ctxCamera.clearRect(0, 0, camW, camH);
      ctxCamera.save();
      ctxCamera.translate(camW/2,camH/2);
      ctxCamera.rotate(-Math.PI/180*this.rotation);
      ctxCamera.drawImage(ground, captX-camW/2, captY-camH/2, camW, camH, -camW/2, -camH/2, camW, camH);
      ctxCamera.restore();

      //调试地面相机使用
      /*
      let ctxGround = ground.getContext('2d');
      let styleOrig = ctxGround.strokeStyle;
      ctxGround.strokeStyle = '#FF0000';
      ctxGround.beginPath();
      ctxGround.arc(captX,captY,1,0,2*Math.PI);
      ctxGround.stroke()
      ctxGround.rect(captX-camW/2, captY-camH/2, camW, camH);
      ctxGround.stroke();
      ctxGround.strokeStyle = styleOrig;
      */
    },
  },
  mounted(){
  },
}

