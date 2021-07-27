const PoweredUP=require('node-poweredup');
const Joystick=require('joystick');

const poweredUp=new PoweredUP.PoweredUP();
const joystick=new Joystick(2,3500,0);

poweredUp.on('discover',async function(hub){
  console.log('Discovered: '+hub.name);
  await hub.connect();
  console.log('connected',hub.uuid);
  const [motorA,motorB,motorC] = await Promise.all([
    hub.waitForDeviceAtPort("A"),
    hub.waitForDeviceAtPort("B"),
    hub.waitForDeviceAtPort("C")
  ]);

  motorA.setAccelerationTime(1);
  motorB.setAccelerationTime(1);
  motorC.setAccelerationTime(1);
  motorA.setDecelerationTime(1);
  motorB.setDecelerationTime(1);
  motorC.setDecelerationTime(1);

  //Calibrate
  let minAngle=maxAngle=null;
  let calibrateFunc=(e)=>{
    let angle=Number(e.degrees);
    console.log('calibrateFunc',angle);
    if(isNaN(angle)){
      return;
    }
    console.log(angle);
    if(null==minAngle || angle<minAngle){
      minAngle=angle;
    }
    if(null==maxAngle || angle>maxAngle){
      maxAngle=angle;
    }
  }
  motorC.on('rotate',calibrateFunc);
  motorC.setSpeed(-50);
  await hub.sleep(2000);
  motorC.setSpeed(50);
  await hub.sleep(2000);
  motorC.off('rotate',calibrateFunc);

  let mediumAngle=(maxAngle+minAngle)/2;
  let range=(maxAngle-minAngle)/2;
  motorC.gotoAngle(mediumAngle,100);
  await hub.sleep(1000);
  motorC.resetZero();
  motorC.gotoAngle(0,100);

  joystick.on('axis',(e)=>{
    console.log(e);
    if(0==e.number){
      motorC.gotoAngle(range*e.value/32767,100);
    }
    if(3==e.number){
      /*
      if(Math.abs(e.value)<100){
        motorA.brake();
        motorB.brake();
      }else{
      */
        motorA.setSpeed(100*e.value/32767);
        motorB.setSpeed(100*e.value/32767);
      //}
    }
  });
  joystick.on('button',(e)=>{
    if(0==e.number && 1==e.value){
      motorA.brake();
      motorB.brake();
      motorC.brake();
    }
  });
});
//Load joystick
joystick.on('ready',()=>{
  poweredUp.scan();
  console.log('Start discovering');
});
console.log('Loading Joystick');

