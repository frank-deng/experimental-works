const PoweredUP=require('node-poweredup');
const EvdevReader=require('evdev');
const $CONFIG=require('./config.json');

const poweredUp=new PoweredUP.PoweredUP();
const reader=new EvdevReader();

let running=true;
async function onDiscover(hub){
  if($CONFIG.hubId && hub.uuid!=$CONFIG.hubId){
    return;
  }

  poweredUp.stop();
  poweredUp.off('discover',onDiscover);
  await hub.connect();

  console.log('Hub connected, uuid: ',hub.uuid);
  const [motorA,motorB,motorC] = await Promise.all([
    hub.waitForDeviceAtPort("A"),
    hub.waitForDeviceAtPort("B"),
    hub.waitForDeviceAtPort("C")
  ]);

  //Calibrate
  /*
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
  motorC.gotoAngle(mediumAngle,30);
  await hub.sleep(2000);
  await motorC.resetZero();
  await motorC.gotoAngle(0,100);
  */

  await Promise.all([
    motorA.setAccelerationTime(1),
    motorA.setDecelerationTime(1),
    motorB.setAccelerationTime(1),
    motorB.setDecelerationTime(1),
    motorC.setAccelerationTime(1),
    motorC.setDecelerationTime(1)
  ]);

  await motorC.gotoAngle(0,100);

  let currentAngle=0;
  motorC.on('rotate',(e)=>{
    currentAngle=Number(e.degrees);
  });
  reader.on("EV_ABS",(data)=>{
    if($CONFIG.steerAxis==data.code){
      let requestAngle=Math.round(90*(data.value-128)/128);
      speed=Math.abs(currentAngle-requestAngle)/180*100;
      speed=Math.min(Math.max(speed,1),100);
      motorC.gotoAngle(requestAngle,speed);
    }else if($CONFIG.throttleAxis==data.code){
      let value=Math.round((data.value-128)*100/128);
      motorA.setPower(value);
      motorB.setPower(value);
    }
  });

  reader.on("EV_KEY",(data)=>{
    if($CONFIG.brakeButton==data.code && data.value){
      motorA.brake();
      motorB.brake();
      motorC.brake();
    }
  });

  while(running){
    await hub.sleep(10);
  }
}

poweredUp.on('discover',onDiscover);

process.on('SIGINT',function exitFunction(){
  try{
    running=false;
    poweredUp.stop();
    reader.close();
    console.log('Exit.');
  }catch(e){
    console.error(e);
  }finally{
    //process.exit();
    process.kill(process.pid,'SIGKILL');
  }
});

//Load joystick
reader.search('/dev/input/by-id','event-joystick',(err,files)=>{
  if(err){
    console.error(err);
    return;
  }
  if(!files.length){
    console.error('No joystick found.');
    return;
  }

  //Find the joystick to use
  let file=files[0];
  if($CONFIG.joystick){
    for(let item of files){
      if(-1!=item.indexOf($CONFIG.joystick)){
        file=item;
        break;
      }
    }
  }

  let device=reader.open(file);
  device.on('open',()=>{
    console.log('Joystick loaded, start scanning.');
    poweredUp.scan();
  });
});

