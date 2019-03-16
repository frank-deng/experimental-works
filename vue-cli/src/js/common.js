export function fitRect(wRect,hRect,wImage,hImage){
  var ratioSrc = wImage / hImage, ratioDest = wRect / hRect;
  var scale = (ratioSrc > ratioDest) ? (wImage / wRect) : (hImage / hRect);
  return [wImage / scale, hImage / scale];
}
export function fillRect(wRect,hRect,wImage,hImage){
  var ratioSrc = wImage / hImage, ratioDest = wRect / hRect;
  var scale = (ratioSrc > ratioDest) ? (hImage / hRect) : (wImage / wRect);
  return [wImage / scale, hImage / scale];
}
export function readFile(file){
  let reader = new FileReader();
  return new Promise((resolve,reject)=>{
    reader.addEventListener('abort',(e)=>{
      reject(e);
    })
    reader.addEventListener('error',(e)=>{
      reject(e);
    })
    reader.addEventListener('load',(e)=>{
      resolve(e.target.result);
    })
    reader.readAsDataURL(file);
  })
}
