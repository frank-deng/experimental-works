export function image2dataURL(image, type=undefined, quality=undefined){
  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  let dest = ctx.getImageData(0,0,canvas.width,canvas.height);
  let w = image.width, h = image.height, srcLineLength = image.width / 8;
  for(let y = 0; y < h; y++){
    for(let x = 0; x < w; x++){
      let offsetSrc = (y*srcLineLength+(x>>3));
      let value = image.data[offsetSrc] & (1<<(7-(x&7)));
      let offset = (y*w+x)*4;
      dest.data[offset] = dest.data[offset+1] = dest.data[offset+2] = (value ? 0xff : 0);
      dest.data[offset+3] = 0xff;
    }
  }
  ctx.putImageData(dest,0,0);
  return canvas.toDataURL(type,quality);
}
var memcpy = function(target, targetOffset, src, srcOffset, length){
  for(let i = 0; i < length; i++){
    target[targetOffset+i] = src[srcOffset+i];
  }
}
export function image2CGA(image){
  if(image.width != 640 || image.height != 200){
    throw new Error('Invalid image format: 640x200 monochrome image required.');
  }
  let result = new Uint8Array(16392);
  let header = [0xfd,0x00,0xb8,0x00,0x00,0x00,0x40];
  memcpy(result,0,header,0,header.length);
  let i = 0;
  for(let y = 0; y < image.height; y+=2){
    memcpy(result,7+i*80,image.data,y*80,80);
    i++;
  }
  i = 0;
  for(let y = 1; y < image.height; y+=2){
    memcpy(result,7+8192+i*80,image.data,y*80,80);
    i++;
  }
  result[7+8192*2] = 0x1A;
  return new Blob([result]);
}
