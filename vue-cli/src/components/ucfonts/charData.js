var jumpStep=[
  4,2,2,4,
  8,12,8,3,
  3,2,3,4,
  6,6,9,4
];
var paramParser=[
  //0
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
    };
  },
  //1
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
    };
  },
  //2
  (data)=>{
    return{
      y1:(data[0]<<4)|data[1],
    };
  },
  //3
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
    };
  },
  //4
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
      x2:(data[4]<<4)|data[5],
      y2:(data[6]<<4)|data[7],
    };
  },
  //5
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
      x2:(data[4]<<4)|data[5],
      y2:(data[6]<<4)|data[7],
      x3:(data[8]<<4)|data[9],
      y3:(data[10]<<4)|data[11],
    };
  },
  //6
  (data)=>{
    return{
      x1:(data[0]<<4)|data[1],
      y1:(data[2]<<4)|data[3],
      x2:(data[4]<<4)|data[5],
      y2:(data[6]<<4)|data[7],
    };
  },
  //7
  (data)=>{
    let dx=data[0]&0x7;
    return{
      dx1:(0x8&data[0]?-dx:dx),
      y1:(data[1]<<4)|data[2],
    };
  },
  //8
  (data)=>{
    let dy=data[2]&0x7;
    return{
      x1:(data[0]<<4)|data[1],
      dy1:(0x8&data[2]?-dy:dy),
    };
  },
  //9
  (data)=>{
    let dx=data[0]&0x7, dy=data[1]&0x7;
    return{
      dx1:(0x8&data[0]?-dx:dx),
      dy1:(0x8&data[1]?-dy:dy),
    };
  },
  //10
  (data)=>{
    let dx=(data[0]<<2)|(data[1]>>2);
    let dy=((data[1]&0x3)<<4)|data[2];
    return{
      dx1:(32&dx?-(dx&31):(dx&31)),
      dy1:(32&dy?-(dy&31):(dy&31)),
    };
  },
  //11
  (data)=>{
    let dx1=data[0],dy1=data[1],dx2=data[2],dy2=data[3];
    return{
      dx1:(8&dx1?-(dx1&7):(dx1&7)),
      dy1:(8&dy1?-(dy1&7):(dy1&7)),
      dx2:(8&dx2?-(dx2&7):(dx2&7)),
      dy2:(8&dy2?-(dy2&7):(dy2&7)),
    };
  },
  //12
  (data)=>{
    let dx1=(data[0]<<2)|(data[1]>>2);
    let dy1=((data[1]&0x3)<<4)|data[2];
    let dx2=(data[3]<<2)|(data[4]>>2);
    let dy2=((data[4]&0x3)<<4)|data[5];
    return{
      dx1:(32&dx1?-(dx1&31):(dx1&31)),
      dy1:(32&dy1?-(dy1&31):(dy1&31)),
      dx2:(32&dx2?-(dx2&31):(dx2&31)),
      dy2:(32&dy2?-(dy2&31):(dy2&31)),
    };
  },
  //13
  (data)=>{
    let dx1=data[0],dy1=data[1],dx2=data[2],dy2=data[3],dx3=data[4],dy3=data[5];
    return{
      dx1:(8&dx1?-(dx1&7):(dx1&7)),
      dy1:(8&dy1?-(dy1&7):(dy1&7)),
      dx2:(8&dx2?-(dx2&7):(dx2&7)),
      dy2:(8&dy2?-(dy2&7):(dy2&7)),
      dx3:(8&dx3?-(dx3&7):(dx3&7)),
      dy3:(8&dy3?-(dy3&7):(dy3&7)),
    };
  },
  //14
  (data)=>{
    let dx1=(data[0]<<2)|(data[1]>>2);
    let dy1=((data[1]&0x3)<<4)|data[2];
    let dx2=(data[3]<<2)|(data[4]>>2);
    let dy2=((data[4]&0x3)<<4)|data[5];
    let dx3=(data[5]<<2)|(data[6]>>2);
    let dy3=((data[6]&0x3)<<4)|data[7];
    return{
      dx1:(32&dx1?-(dx1&31):(dx1&31)),
      dy1:(32&dy1?-(dy1&31):(dy1&31)),
      dx2:(32&dx2?-(dx2&31):(dx2&31)),
      dy2:(32&dy2?-(dy2&31):(dy2&31)),
      dx3:(32&dx3?-(dx3&31):(dx3&31)),
      dy3:(32&dy3?-(dy3&31):(dy3&31)),
    };
  },
  //15
  (data)=>{
  },
];
var drawLine=function(image,x0,y0,x1,y1){
  let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0);
  let sx=x0<x1?1:-1, sy=y0<y1?1:-1;
  let err=(dx>dy?dx:-dy)/2,e2=null;
  while(true){
    //Set Pixel
    if(x0>=0 && x0<image.width && y0>=0 && y0<image.height){
      let offset=(y0*image.width+x0)*4;
      image.data[offset]=image.data[offset+1]=image.data[offset+2]=0x00;
      image.data[offset+3]=0xff;
    }
    
    if(x0==x1 && y0==y1){
      break;
    }
    e2=err;
    if(e2>-dx){
      err-=dy;
      x0+=sx;
    }
    if(e2<dy){
      err+=dx;
      y0+=sy;
    }
  }
}
var drawBezier=function(image,x0,y0,x1,y1,x2,y2,fraction){
  let x=x0,y=y0;
  for(let i=0;i<=fraction;i++){
    let percent = (i/fraction);

    let mx0=(x0+(x1-x0)*percent), my0=(y0+(y1-y0)*percent);
    let mx1=(x1+(x2-x1)*percent), my1=(y1+(y2-y1)*percent);
    let px=(mx0+(mx1-mx0)*percent), py=(my0+(my1-my0)*percent);
    drawLine(image,x,y,px,py);
    x=px;y=py;
  }
}
var drawFont=function(canvas,ctx,operList){
  var cx=0,cy=0,image=ctx.getImageData(0,0,canvas.width,canvas.height);
  var handler=[
    (param)=>{
      cx=param.x1;cy=param.y1;
      ctx.beginPath();
      ctx.arc(cx,cy,2,0,2*Math.PI);
      ctx.fill();
    },
    (param)=>{
      drawLine(image,cx,cy,param.x1,cy);
      cx=param.x1;
      /*
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      cx=param.x1;
      ctx.lineTo(cx,cy);
      ctx.stroke();
      */
    },
    (param)=>{
      drawLine(image,cx,cy,cx,param.y1);
      cy=param.y1;
      /*
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      cy=param.y1;
      ctx.lineTo(cx,cy);
      ctx.stroke();
      */
    },
    (param)=>{
      drawLine(image,cx,cy,param.x1,param.y1);
      cx=param.x1;
      cy=param.y1;
      /*
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      cx=param.x1;
      cy=param.y1;
      ctx.lineTo(cx,cy);
      ctx.stroke();
      */
    },
    (param)=>{
      drawBezier(image,cx,cy,param.x1,param.y1,param.x2,param.y2);
      cx=param.x2;
      cy=param.y2;
      /*
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      cx=param.x2;
      cy=param.y2;
      ctx.bezierCurveTo(param.x1,param.y1,cx,cy,cx,cy);
      ctx.stroke();
      */
    },
    (param)=>{
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      cx=param.x3;
      cy=param.y3;
      ctx.bezierCurveTo(param.x1,param.y1,param.x2,param.y2,cx,cy);
      ctx.stroke();
    },
  ];
  ctx.strokeStyle='#000000';
  ctx.fillStyle='#ff0000';
  for(let item of operList){
    if(!handler[item.oper]){
      continue;
    }
    handler[item.oper](item.param);
  }
  drawLine(image,1,1,30,64);
  drawLine(image,1,1,30,14);
  drawLine(image,20,4,10,30);
  drawLine(image,-10,-10,200,400);
  ctx.putImageData(image,0,0);
}

export default{
  props:{
    fontData:null,
  },
  data(){
    return{
      fontDataExtract:null,
      steps:'-',
    };
  },
  computed:{
    fontDataDisplay(){
      if(!(this.fontDataExtract instanceof Uint8Array)){
        return '无数据';
      }
      return this.fontDataExtract.map((n)=>{
        return n.toString(16);
      }).join('');
    },
    fontDataLen(){
      if(!(this.fontDataExtract instanceof Uint8Array)){
        return '无数据';
      }
      return this.fontDataExtract.length;
    },
  },
  watch:{
    fontData:{
      immediate:true,
      handler(fontData){
        if(!(fontData instanceof Uint8Array)){
          this.fontDataExtract=null;
          return;
        }
        let fontDataExtract=new Uint8Array(fontData.length*2);
        let i=0;
        for(let n of fontData){
          fontDataExtract[i]=n&0xf;
          i++;
          fontDataExtract[i]=n>>4;
          i++;
        }
        this.fontDataExtract=fontDataExtract;
        this.steps=this.check(fontDataExtract);
	this.$nextTick(()=>{
          let canvas=this.$refs.preview;
          let ctx=canvas.getContext('2d');
          drawFont(canvas,ctx,this.steps);
	})
      },
    },
  },
  methods:{
    check(fontData){
      let offset=0, steps=[];
      while(offset<fontData.length){
        let oper=fontData[offset];
        if(0==oper && offset==(fontData.length-1)){
          offset++;
          break;
        }
        let paramData=fontData.slice(offset+1,offset+jumpStep[oper]+1);
        if(paramParser[oper]){
          paramData=paramParser[oper](paramData);
        }
        steps.push({
          oper:oper,
          param:paramData,
        });
        offset+=jumpStep[oper]+1;
      }
      if(offset-fontData.length){
        throw new Error('无效字符轮廓数据');
      }
      return steps;
    },
  },
}
