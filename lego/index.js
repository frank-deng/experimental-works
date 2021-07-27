const PoweredUP=require('node-poweredup');
const Joystick=require('joystick');

const poweredUp=new PoweredUP.PoweredUP();
const joystick=new Joystick(1,3500,0);

let masterHub=null;
poweredUp.on('discover',async function(hub){
  console.log('Discovered: '+hub.name);
  masterHub=hub;
  await hub.connect();
  console.log('connected',hub.uuid);
  const [motorA,motorB,motorC] = await Promise.all([
    hub.waitForDeviceAtPort("A"),
    hub.waitForDeviceAtPort("B"),
    hub.waitForDeviceAtPort("C")
  ]);

  //Calibrate
  let minAngle=maxAngle=null;
  let calibrateFunc=(e)=>{
    let angle=Number(e.degrees);
    if(isNaN(angle)){
      return;
    }
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

  let mediumAngle=Math.round((maxAngle+minAngle)/2);
  let range=(maxAngle-minAngle)/2;
  console.log(minAngle, maxAngle, mediumAngle, range);
  motorC.gotoAngle(mediumAngle,30);
  await hub.sleep(2000);
  motorC.resetZero();
  motorC.gotoAngle(0,100);

  motorA.setAccelerationTime(1);
  motorA.setDecelerationTime(1);
  motorB.setAccelerationTime(1);
  motorB.setDecelerationTime(1);
  motorC.setAccelerationTime(1);
  motorC.setDecelerationTime(1);

  joystick.on('axis',(e)=>{
    console.log(e);
    if(0==e.number){
      let angle=Math.round(range*e.value/32767);
      console.log('Angle',angle);
      motorC.gotoAngle(angle,50);
    }
    if(3==e.number){
      if(Math.abs(e.value)<10){
        motorA.brake();
        motorB.brake();
      }else{
        motorA.setPower(Math.round(100*e.value/32767));
        motorB.setPower(Math.round(100*e.value/32767));
      }
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

//Handle exit function
function exitFunction(){
  console.log('Start exit');
  //process.exit();
  process.kill(process.pid,'SIGKILL');
}

//Load joystick
joystick.on('ready',()=>{
  poweredUp.scan();
  console.log('Start discovering');
  process.on('SIGINT',exitFunction);
  process.on('exit',exitFunction);
});
console.log('Loading Joystick');

