const EvdevReader=require('evdev');
const reader=new EvdevReader();
reader.search('/dev/input/by-id','event-joystick',(err,files)=>{
  if(err){
    return;
  }

  let device=reader.open(files[0]);
  device.on('open',()=>{
    console.log(device.id);
    reader.on("EV_KEY",function(data){
      console.log("key : ",data.code,data.value);
    }).on("EV_ABS",function(data){
      console.log("Absolute axis : ",data.code,data.value);
    }).on("EV_REL",function(data){
      console.log("Relative axis : ",data.code,data.value);
    });
  });
})

