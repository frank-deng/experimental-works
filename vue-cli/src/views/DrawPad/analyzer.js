var scanVertical = function(image,x){
  for(let y=0;y<image.width;y++){
    try{
      let alpha = image.data[(y*image.width+x)*4+3];
      if(alpha>16){
        return true;
      }
    }catch(e){
      console.error(e);
      continue;
    }
  }
  return false;
}
export function analyzeGround(camera){
  let ctx = camera.getContext('2d');
  let cw = camera.width, ch = camera.height;
  let camData = ctx.getImageData(cw/4, ch/4, cw/2, ch/2);
  let w = camData.width, h = camData.height;

  //从左侧扫描
  let borderLeft=null;
  for(let x=0;x<w && null===borderLeft;x++){
    if(scanVertical(camData,x)){
      borderLeft = x/w*2-1;
    }
  }

  //从右侧扫描
  let borderRight=null;
  for(let x=w-1;x>=0 && null===borderRight;x--){
    if(scanVertical(camData,x)){
      borderRight = x/w*2-1;
    }
  }

  //给地面相机画上红框（测试用）
  ctx.rect(cw/4, ch/4, cw/2, ch/2);
  let styleOrig = ctx.strokeStyle;
  ctx.strokeStyle = '#FF0000';
  ctx.stroke();
  ctx.strokeStyle = styleOrig;
  
  return [borderLeft,borderRight];
}
export function getSteer(left, right){
  let delta = (left+right)/2;
  return delta*8;
}
