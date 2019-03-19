import FileReader from "promisify-file-reader"
import {fitRect, fillRect} from '@/js/common.js'
import {
  image2dataURL,
  image2CGA,
} from './util.js'
import {getMonochromeImage} from '@/js/monochromeImage.js'
var drawMonochrome = function(dest, src){
  let srcLineLength = src.width / 8;
  for(let y = 0; y < src.height; y++){
    for(let x = 0; x < src.width; x++){
      let offsetSrc = (y*srcLineLength+(x>>3));
      let value = src.data[offsetSrc] & (1<<(7-(x&7)));
      let offset = (y*src.width+x)*4;
      dest.data[offset] = dest.data[offset+1] = dest.data[offset+2] = (value ? 0xff : 0);
    }
  }
}
var drawMonochrome2x = function(dest, src){
  let srcLineLength = src.width / 8;
  for(let y = 0; y < src.height; y++){
    for(let x = 0; x < src.width; x++){
      let offsetSrc = (y*srcLineLength+(x>>3));
      let value = src.data[offsetSrc] & (1<<(7-(x&7)));
      let offset = (y*2*src.width+x)*4;
      dest.data[offset] = dest.data[offset+1] = dest.data[offset+2] = (value ? 0xff : 0);
      offset = ((y*2+1)*src.width+x)*4;
      dest.data[offset] = dest.data[offset+1] = dest.data[offset+2] = (value ? 0xff : 0);
    }
  }
}
export default{
  props:{
    file:null,
    backgroundColor:String,
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
    file:{
      immediate:true,
      handler(image){
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
    backgroundColor(){
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
      this.result = null;
      return new Promise((resolve,reject)=>{
        let image = new Image();
        image.addEventListener('load', ()=>{
          resolve(image);
        });
        image.addEventListener('error', ()=>{
          reject('图片加载失败');
        });
        new FileReader().readAsDataURL(this.file).then((src)=>{
          image.src = src;
        }).catch((e)=>{
          reject(e);
        });
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
        ctx.fillStyle = this.backgroundColor;
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
        this.result = getMonochromeImage(imageData, this.dither);
        drawMonochrome(imageData, this.result);
        ctx.putImageData(imageData,0,0);

        //将最终结果传出去
        this.$emit('change', this.result);
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
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
        drawMonochrome2x(imageData, this.result);
        ctx.putImageData(imageData,0,0);
      })
    },
    saveImage(index){
      if(!this.result){
        return;
      }
      this.$saveAs(image2dataURL(this.result, 'image/png'), null, '.png', '保存PNG');
    },
    saveImageCGA(index){
      if(!this.result){
        return;
      }
      this.$saveAs(image2CGA(this.result), null, '.pic', '保存PIC');
    },
  },
}
