const PoweredUP=require('node-poweredup');
const poweredUp=new PoweredUP.PoweredUP();

poweredUp.on('discover',async(hub)=>{
  console.log('Discovered: '+hub.name);
  await hub.connect();
  console.log('connected');
  hub.setMotorSpeed('A',50,20000);
  console.log('finished');
});
poweredUp.scan();
console.log('Start discovering');

