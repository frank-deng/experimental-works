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
