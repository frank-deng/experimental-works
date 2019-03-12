var fitRect = function(wRect,hRect,wImage,hImage){
  var ratioSrc = wImage / hImage, ratioDest = wRect / hRect;
  var scale = (ratioSrc > ratioDest) ? (wImage / wRect) : (hImage / hRect);
  return [wImage / scale, hImage / scale];
}
var fillRect = function(wRect,hRect,wImage,hImage){
  var ratioSrc = wImage / hImage, ratioDest = wRect / hRect;
  var scale = (ratioSrc > ratioDest) ? (hImage / hRect) : (wImage / wRect);
  return [wImage / scale, hImage / scale];
}
var saturationAdd = function(image,x,y,offset){
  if(x<0 || y<0 || x>=image.width || y>=image.height){
    return false;
  }
  let value = image.data[y*image.width+x];
  value += offset;
  image.data[y*image.width+x] = value;
  return true;
}
var color2monochrome = function(image, dither){
  let result = {
    width:image.width,
    height:image.height,
    data:new Array(image.width * image.height),
  };
  for(let y = 0; y < image.height; y++){
    for(let x = 0; x < image.width; x++){
      let offset = (y*image.width+x)*4;
      let r = image.data[offset], g = image.data[offset+1], b = image.data[offset+2];
      let value = Math.floor((0.2125 * r) + (0.7154 * g) + (0.0721 * b));
      result.data[y*image.width+x] = value;
    }
  }
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
  return result;
}
var drawMonochrome = function(dest, src){
  for(let y = 0; y < src.height; y++){
    for(let x = 0; x < src.width; x++){
      let offset = (y*src.width+x)*4;
      dest.data[offset] = dest.data[offset+1] = dest.data[offset+2] = src.data[y*src.width+x];
    }
  }
}
var drawMonochrome2x = function(dest, src){
  for(let y = 0; y < src.height; y++){
    for(let x = 0; x < src.width; x++){
      let offset = (y*2*src.width+x)*4;
      dest.data[offset] = dest.data[offset+1] = dest.data[offset+2] = src.data[y*src.width+x];
      offset = ((y*2+1)*src.width+x)*4;
      dest.data[offset] = dest.data[offset+1] = dest.data[offset+2] = src.data[y*src.width+x];
    }
  }
}
export default{
  props:{
    image:null,
    layout:{
      default:'fit',
    },
    dither:{
      default:'floyd-steinberg',
    },
  },
  data(){
    return{
      result:null,
      preview:false,
    };
  },
  watch:{
    image:{
      immediate:true,
      handler(image){
        if(!(image instanceof File)){
          console.error('Invalid type of image object.');
          return;
        }
        this.$nextTick(()=>{
          this.processImage();
        });
      },
    },
    layout(){
      this.$nextTick(()=>{
        this.processImage();
      });
    },
    dither(){
      this.$nextTick(()=>{
        this.processImage();
      });
    },
  },
  methods:{
    processImage(){
      return new Promise((resolve,reject)=>{
        let reader = new FileReader();
        let image = new Image();
        reader.addEventListener('load', (event)=>{
          image.src = event.target.result;
        });
        image.addEventListener('load', ()=>{
          resolve(image);
        });
        image.addEventListener('error', ()=>{
          reject('图片加载失败');
        });
        reader.readAsDataURL(this.image);
      }).then((imageObject)=>{
        let canvasWidth = this.$refs.targetImage.width, canvasHeight = this.$refs.targetImage.height;
        let targetWidth = undefined, targetHeight = undefined;
        //计算图片大小
        switch(this.layout){
          case 'fit':
            [targetWidth, targetHeight] = fitRect(canvasWidth, canvasHeight, imageObject.width * 2, imageObject.height);
          break;
          case 'fill':
            [targetWidth, targetHeight] = fillRect(canvasWidth, canvasHeight, imageObject.width * 2, imageObject.height);
          break;
          case 'stretch':
            targetWidth = canvasWidth;
            targetHeight = canvasHeight;
          break;
          case 'center':
          case 'tile':
            targetWidth = imageObject.width;
            targetHeight = imageObject.height;
          break;
        }
        let offsetX = (this.$refs.targetImage.width - targetWidth) / 2;
        let offsetY = (this.$refs.targetImage.height - targetHeight) / 2;
        let ctx = this.$refs.targetImage.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        //平铺图像
        if('tile'==this.layout){
          let ctx = this.$refs.targetImage.getContext('2d');
          for(let y=0;y<=canvasHeight;y+=targetHeight){
            for(let x=0;x<=canvasWidth;x+=targetWidth){
              ctx.drawImage(imageObject,
                0, 0, imageObject.width, imageObject.height,
                x, y, targetWidth, targetHeight
              );
            }
          }
        }else{
          ctx.drawImage(imageObject,
            0, 0, imageObject.width, imageObject.height,
            offsetX, offsetY, targetWidth, targetHeight
          );
        }

        //将图像转成灰度的
        let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
        let monoImage = color2monochrome(imageData, this.dither);
        this.result = monoImage;
        drawMonochrome(imageData, monoImage);
        ctx.putImageData(imageData,0,0);
      });
    },
    doPreview(){
      if(!this.result){
        return;
      }
      this.preview = true;
      this.$nextTick(()=>{
        let canvasWidth = this.$refs.targetImagePreview.width, canvasHeight = this.$refs.targetImagePreview.height;
        let ctx = this.$refs.targetImagePreview.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
        drawMonochrome2x(imageData, this.result);
        ctx.putImageData(imageData,0,0);
      })
    },
  },
}
