var saturationAdd = function(image,x,y,offset){
  if(x<0 || y<0 || x>=image.width || y>=image.height){
    return false;
  }
  let value = image.data[y*image.width+x];
  value += offset;
  image.data[y*image.width+x] = value;
  return true;
}
export function getMonochromeImage(image, dither){
  let result = {
    width:image.width,
    height:image.height,
    data:new Array(image.width * image.height),
  };

  //Color to grayscale
  for(let y = 0; y < image.height; y++){
    for(let x = 0; x < image.width; x++){
      let offset = (y*image.width+x)*4;
      let r = image.data[offset], g = image.data[offset+1], b = image.data[offset+2];
      let value = Math.floor((0.2125 * r) + (0.7154 * g) + (0.0721 * b));
      result.data[y*image.width+x] = value;
    }
  }

  //Dither grayscale image to monochrome
  if('none' == dither){
    for(let y = 0; y < image.height; y++){
      for(let x = 0; x < image.width; x++){
        let value = result.data[y*image.width+x];
        result.data[y*image.width+x] = (value<128 ? 0 : 0xFF);
      }
    }
  }else if('ordered' == dither){
    let ditherMatrix = [
      [0, 48,12,60,3, 51,15,63],
      [32,16,44,28,35,19,47,31],
      [8, 56,4, 52,11,59,7, 55],
      [40,24,36,20,43,27,39,23],
      [2, 50,14,62,1, 49,13,61],
      [34,18,46,30,33,17,45,29],
      [10,58,6, 54,9, 57,5, 53],
      [42,26,38,22,41,25,37,21],
    ];
    for(let y = 0; y < image.height; y++){
      for(let x = 0; x < image.width; x++){
        let value = Math.floor(result.data[y*image.width+x]*64/0xFF);
        let dx = x & 0x07, dy = y & 0x07;
        result.data[y*image.width+x] = (value<=ditherMatrix[dy][dx] ? 0 : 0xFF);
      }
    }
  }else if('min-avg-error'==dither){
    //Minimal average error
    for(let y = 0; y < image.height; y++){
      for(let x = 0; x < image.width; x++){
        let value = result.data[y*image.width+x];
        let newValue = value<128 ? 0 : 0xFF;
        result.data[y*image.width+x] = newValue;
        let error = value - newValue;
        saturationAdd(result, x+1, y, error*7/48);
        saturationAdd(result, x+2, y, error*5/48);

        saturationAdd(result, x-2, y+1, error*3/48);
        saturationAdd(result, x-1, y+1, error*5/48);
        saturationAdd(result, x, y+1, error*7/48);
        saturationAdd(result, x+1, y+1, error*5/48);
        saturationAdd(result, x+2, y+1, error*3/48);

        saturationAdd(result, x-2, y+2, error*1/48);
        saturationAdd(result, x-1, y+2, error*3/48);
        saturationAdd(result, x, y+2, error*5/48);
        saturationAdd(result, x+1, y+2, error*3/48);
        saturationAdd(result, x+2, y+2, error*1/48);
      }
    }
  }else{
    //Floyd-Steinberg
    for(let y = 0; y < image.height; y++){
      for(let x = 0; x < image.width; x++){
        let value = result.data[y*image.width+x];
        let newValue = value<128 ? 0 : 0xFF;
        result.data[y*image.width+x] = newValue;
        let error = value - newValue;
        saturationAdd(result, x+1, y, error*7/16);
        saturationAdd(result, x-1, y+1, error*3/16);
        saturationAdd(result, x, y+1, error*5/16);
        saturationAdd(result, x+1, y+1, error*1/16);
      }
    }
  }

  //Compress monochrome image to bitwise format
  let lineLength = image.width / 8;
  let finalBuffer = new Uint8Array(lineLength * image.height);
  for(let y = 0; y < image.height; y++){
    for(let x = 0; x < image.width; x++){
      let value = result.data[y*image.width+x];
      if(value){
        finalBuffer[y*lineLength + (x>>3)] |= (1<<(7-(x&7)));
      }
    }
  }
  result.data = finalBuffer;
  return result;
}

