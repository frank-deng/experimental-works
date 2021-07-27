const Joystick=require('joystick');
const joystick=new Joystick(2,3500,0);
joystick.on('ready',(e)=>{
  console.log('Joystick ready',e);
});
joystick.on('button',(e)=>{
  console.log(e);
});
joystick.on('axis',(e)=>{
  console.log(e);
});

