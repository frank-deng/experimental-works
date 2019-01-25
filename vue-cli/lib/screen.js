import {getFont16, getFont12} from './font.js';

var fgcol = 0x000000ff, width = 240, height = 320, rowCnt = width/16, scale = 4;
var imageTemplate = [];

var setPixel=function(image,x,y,fg){
  let r=(fg>>24)&0xff, g=(fg>>16)&0xff, b=(fg>>8)&0xff, a=fg&0xff;
  let offset = (y*image.width+x)*4;
  image.data[offset] = r;
  image.data[offset+1] = g;
  image.data[offset+2] = b;
  image.data[offset+3] = a;
}
var drawPixel=function(image, x0, fg){
  for(let y=0;y<scale-1;y++){
    for(let x=0;x<scale-1;x++){
      setPixel(image,x+x0*scale,y,fg);
    }
  }
}
var createImageTemplate=function(ctx, data, fg){
  let result = ctx.createImageData(16*scale, scale);
  for(let i=0; i<16; i++){
    if (data & (1<<(15-i))){
      drawPixel(result,i,fg);
    }
  }
  return result;
}
var pat8=function(target,data,h,x,y,op=0){
  let offset=rowCnt*y+(x>>4);
  if((x&0xf)<9){
    let shift=8-(x&0xf),mask=~(0xff<<shift);
    switch(op){
      case 0:
        for(let i=0;i<h;i++){
          target[offset]&=mask;
          target[offset]|=((data[i]&0xff)<<shift);
          offset+=rowCnt;
        }
      break;
      case 1:
        for(let i=0;i<h;i++){
          target[offset]|=((data[i]&0xff)<<shift);
          offset+=rowCnt;
        }
      break;
    }
    return;
  }
  //Inter-segment operation
  let shift=x&0xf, mask=~(0xff00>>shift), mask2=~(0xff<<(16-shift));
  switch(op){
    case 0:
      for(let i=0;i<h;i++){
        target[offset]&=mask;
        target[offset]|=(data[i]&0xff)>>(shift-8);
        target[offset+1]&=mask2;
        target[offset+1]|=(data[i]<<(24-shift))&0xffff;
        offset+=rowCnt;
      }
    break;
    case 1:
      for(let i=0;i<h;i++){
        target[offset]|=(data[i]&0xff)>>(shift-8);
        target[offset+1]|=(data[i]<<(24-shift))&0xffff;
        offset+=rowCnt;
      }
    break;
  }
}
var pat16=function(target,data,h,x,y,op=0){
  let offset=rowCnt*y+(x>>4);
  if(!(x&0xf)){
    switch(op){
      case 0:
        for(let i=0;i<h;i++){
          target[offset]=data[i];
          offset+=rowCnt;
        }
      break;
      case 1:
        for(let i=0;i<h;i++){
          target[offset]|=data[i];
          offset+=rowCnt;
        }
      break;
    }
    return;
  }
  //Inter-segment operation
  let shift=x&0xf, mask=~(0xffff>>shift);
  switch(op){
    case 0:
      for(let i=0;i<h;i++){
        target[offset]&=mask;
        target[offset]|=data[i]>>shift;
        target[offset+1]&=(~mask);
        target[offset+1]|=(data[i]<<(16-shift))&0xffff;
        offset+=rowCnt;
      }
    break;
    case 1:
      for(let i=0;i<h;i++){
        target[offset]|=data[i]>>shift;
        target[offset+1]|=(data[i]<<(16-shift))&0xffff;
        offset+=rowCnt;
      }
    break;
  }
}
var _pattern=function(target,data,w,h,x,y,op=0){
  let offset=rowCnt*y+(x>>4);
  if((x&0xf)<=(16-w)){
    let ox=x&0xf,shift=16-w-ox,mask=(~(((1<<w)-1)<<shift))&0xffff;
    switch(op){
      case 0:
        for(let i=0;i<h;i++){
          target[offset]&=mask;
          target[offset]|=(data[i]>>ox);
          offset+=rowCnt;
        }
      break;
      case 1:
        for(let i=0;i<h;i++){
          target[offset]|=(data[i]>>ox);
          offset+=rowCnt;
        }
      break;
    }
    return;
  }
  //Inter-segment operation
  let ox=x&0xf,shift=16-ox,mask=~(0xffff>>ox),mask2=(~(0xffff<<(32-ox-w)))&0xffff;
  mask&=0xffff;
  mask2&=0xffff;
  switch(op){
    case 0:
      for(let i=0;i<h;i++){
        target[offset]&=mask;
        target[offset]|=data[i]>>ox;
        target[offset+1]&=mask2;
        target[offset+1]|=(data[i]<<shift)&0xffff;
        offset+=rowCnt;
      }
    break;
    case 1:
      for(let i=0;i<h;i++){
        target[offset]|=data[i]>>ox;
        target[offset+1]|=(data[i]<<shift)&0xffff;
        offset+=rowCnt;
      }
    break;
  }
}

import Vue from 'vue';
export default{
  name:'screen',
  template:`
<canvas ref='canvas' :width='${width*scale}' :height='${height*scale}'></canvas>
  `,
  props:{
    global:{
      default:undefined,
    },
  },
  data(){
    return {
      vram:new Uint16Array(width*height/16),
      canvas:undefined,
      status:0,
      width:width,
      height:height,
    };
  },
  watch:{
    status(status,statusOrig){
      let updateScreen=()=>{
        //Start update screen
        for(let y=0;y<height;y++){for(let x=0;x<rowCnt;x++){
          this.canvas.putImageData(imageTemplate[this.vram[y*rowCnt+x]], x*scale*16, y*scale);
        }}
      }
      if(!statusOrig && status){
        this.status=0;
        requestAnimationFrame(updateScreen);
      }
    },
  },
  methods:{
    generateStyle(x,y,w,h){
      return {
        position:'absolute',
        left:`${x*100.0/width}%`,
        right:`${(width-x-w)*100.0/width}%`,
        top:`${y*100.0/height}%`,
        bottom:`${(height-y-h)*100.0/height}%`,
        cursor:'pointer',
        opacity:0,
      }
    },
    dot(x,y,color){
      if(color){
        this.vram[rowCnt*y+(x>>4)] |= (0x8000>>(x&0xf));
      }else{
        this.vram[rowCnt*y+(x>>4)] &= ~(0x8000>>(x&0xf));
      }
      this.update();
      return this;
    },
    hline(x0,x1,y,color){
      if(y<0||y>=this.height){
        return this;
      }
      if(x0<0){
        x0=0;
      }
      if(x1>=this.width){
        x1=this.width-1;
      }
      let seg0=(x0>>4), seg1=(x1>>4);
      let head = (0xffff>>(x0&0xf));
      let tail = (~((0x8000>>(x1&0xf))-1));
      if (seg0==seg1){
        if(color){
          this.vram[rowCnt*y+seg0] |= (head&tail);
        }else{
          this.vram[rowCnt*y+seg0] &= ~(head&tail);
        }
        return;
      }
      if(color){
        this.vram[rowCnt*y+seg0] |= head;
        this.vram[rowCnt*y+seg1] |= tail;
        for(let i=seg0+1;i<=seg1-1;i++){
          this.vram[rowCnt*y+i] = 0xffff;
        }
      }else{
        this.vram[rowCnt*y+seg0] &= ~head;
        this.vram[rowCnt*y+seg1] &= ~tail;
        for(let i=seg0+1;i<=seg1-1;i++){
          this.vram[rowCnt*y+i] = 0x0000;
        }
      }
      this.update();
      return this;
    },
    vline(x,y0,y1,color){
      let offset=rowCnt*y0+(x>>4);
      if(color){
        let val=(0x8000>>(x&0xf));
        for(let y=y0;y<=y1;y++){
          this.vram[offset] |= val;
          offset+=rowCnt;
        }
      }else{
        let val=~(0x8000>>(x&0xf));
        for(let y=y0;y<=y1;y++){
          this.vram[offset] &= val;
          offset+=rowCnt;
        }
      }
      this.update();
      return this;
    },
    rect(x0,y0,x1,y1,color){
      for(let y=y0;y<=y1;y++){
        this.hline(x0,x1,y,color);
      }
      this.update();
      return this;
    },
    pat8x8(data,x,y,op=0){
      pat8(this.vram,data,8,x,y,op);
      return this;
    },
    pat8x16(data,x,y,op=0){
      pat8(this.vram,data,16,x,y,op);
      return this;
    },
    pat16x8(data,x,y,op){
      pat16(this.vram,data,8,x,y,op);
      return this;
    },
    pat16x16(data,x,y,op){
      pat16(this.vram,data,16,x,y,op);
      return this;
    },
    pattern(data,w,h,x,y,op){
      _pattern(this.vram,data,w,h,x,y,op);
      return this;
    },
    text16(str,x,y,op){
      for(let i=0;i<str.length && x<width;i++){
        let charData=getFont16(str[i]);
        if(!charData){
          x+=8;
          continue;
        }
        if(charData.wide){
          this.pat16x16(charData.data,x,y,op);
          x+=16;
        }else{
          this.pat8x16(charData.data,x,y,op);
          x+=8;
        }
      }
      this.update();
      return this;
    },
    text12(str,x,y,op){
      for(let i=0;i<str.length && x<width;i++){
        let charData=getFont12(str[i]);
        if(!charData){
          x+=6;
          continue;
        }
        if(charData.wide){
          this.pattern(charData.data,12,12,x,y,op);
          x+=12;
        }else{
          this.pattern(charData.data,6,12,x,y,op);
          x+=6;
        }
      }
      this.update();
      return this;
    },
    clear(){
      let len = this.vram.length;
      for(let i=0;i<len;i++){
        this.vram[i]=0;
      }
      this.update();
      return this;
    },
    update(){
      if(!this.status){
        this.status=1;
      }
      return this;
    },
  },
  created(){
    if(undefined!==this.global){
      Vue.prototype.vram = this.vram;
      Vue.prototype.screen = this;
    }
  },
  mounted(){
    this.canvas = this.$refs.canvas.getContext("2d");
    for(let i=0;i<=0xFFFF;i++){
      imageTemplate[i] = createImageTemplate(this.canvas, i, fgcol);
    }
    this.status=1;
  },
}
