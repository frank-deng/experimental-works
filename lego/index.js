const PoweredUP=require('node-poweredup');
const EvdevReader=require('evdev');

const poweredUp=new PoweredUP.PoweredUP();
const reader=new EvdevReader();

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

  reader.on("EV_KEY",function(data){
    if('BTN_A'==data.code && data.value){
      motorA.brake();
      motorB.brake();
      motorC.brake();
    }
  }).on("EV_ABS",function(data){
    if('ABS_X'==data.code){
      let angle=Math.round(range*(data.value-128)/128);
      motorC.gotoAngle(angle,50);
    }
    if('ABS_RZ'==data.code){
      let value=data.value-128;
      if(Math.abs(value)<1){
        motorA.brake();
        motorB.brake();
      }else{
        motorA.setPower(Math.round(100*value/128));
        motorB.setPower(Math.round(100*value/128));
      }
    }
  });
});

function exitFunction(){
  console.log('Exit.');
  reader.close();
  //process.exit();
  process.kill(process.pid,'SIGKILL');
}

//Load joystick
console.log('Loading Joystick');
reader.search('/dev/input/by-id','event-joystick',(err,files)=>{
  if(err){
    console.error(err);
    return;
  }
  if(!files.length){
    console.log('No joystick found');
    return;
  }

  let device=reader.open(files[0]);
  device.on('open',()=>{
    console.log(device);
    console.log('Start discovering');
    poweredUp.scan();
    console.log('Start discovering');
    process.on('SIGINT',exitFunction);
    process.on('exit',exitFunction);
  });
})

