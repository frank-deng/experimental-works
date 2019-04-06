const BASE_WIDTH=170,BASE_HEIGHT=170
//Generate line sequence from bezier curve
var linesBezier2=function(x0,y0,x1,y1,x2,y2,fraction=32){
  let x=x0,y=y0,lines=[];
  for(let i=0;i<=fraction;i++){
    let percent = (i/fraction);
    let mx0=(x0+(x1-x0)*percent), my0=(y0+(y1-y0)*percent);
    let mx1=(x1+(x2-x1)*percent), my1=(y1+(y2-y1)*percent);
    let px=Math.round(mx0+(mx1-mx0)*percent), py=Math.round(my0+(my1-my0)*percent);
    if(px!=x || py!=y){
      lines.push({
        x0:x,y0:y,x1:px,y1:py,
      });
    }
    x=px;y=py;
  }
  return lines;
}
var linesBezier3=function(x0,y0,x1,y1,x2,y2,x3,y3,fraction=32){
  let x=x0,y=y0,lines=[];
  for(let i=0;i<=fraction;i++){
    let percent = (i/fraction);
    let mx0=(x0+(x1-x0)*percent), my0=(y0+(y1-y0)*percent);
    let mx1=(x1+(x2-x1)*percent), my1=(y1+(y2-y1)*percent);
    let mx2=(x2+(x3-x2)*percent), my2=(y2+(y3-y2)*percent);
    let cx0=(mx0+(mx1-mx0)*percent), cy0=(my0+(my1-my0)*percent);
    let cx1=(mx1+(mx2-mx1)*percent), cy1=(my1+(my2-my1)*percent);
    let px=Math.round(cx0+(cx1-cx0)*percent), py=Math.round(cy0+(cy1-cy0)*percent);
    if(px!=x || py!=y){
      lines.push({
        x0:x,y0:y,x1:px,y1:py,
      });
    }
    x=px;y=py;
  }
  return lines;
}

//Actual drawing
var drawLine=function(image,x0,y0,x1,y1){
  if(x0==x1 && y0==y1){
    return;
  }
  let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0);
  let sx=x0<x1?1:-1, sy=y0<y1?1:-1;
  let err=(dx>dy?dx:-dy)/2,e2=null;
  while(true){
    //Set Pixel
    if(x0>=0 && x0<image.width && y0>=0 && y0<image.height){
      let offset=(y0*image.width+x0)*4;
      //image.data[offset]=image.data[offset+1]=image.data[offset+2]=0x00;
      image.data[offset]=0xff;
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
var horFill=function(image,y,lines){
  let lineCuts=[];
  for(let line of lines){
    let x0=line.x0,y0=line.y0+0.5,x1=line.x1,y1=line.y1+0.5;
    //忽略水平的直线
    if(y1==y0){
      continue;
    }
    if(y1<y0){
      let temp=y0;y0=y1;y1=temp;
      temp=x0;x0=x1;x1=temp;
    }
    //当前行与该线不相交
    if(y0>y || y1<=y){
      continue;
    }
    if(x1==x0){
      //处理垂直的直线
      lineCuts.push(x0);
    }else{
      //处理斜线
      lineCuts.push(x0+(x1-x0)*(y-y0)/(y1-y0));
    }
  }
  lineCuts.sort((a,b)=>{
    return (a>b?1:(a<b?-1:0));
  });
  for(let x=0;x<image.width;x++){
    for(let i=0;i<lineCuts.length;i+=2){
      if(x>=lineCuts[i] && x<lineCuts[i+1]){
        let offset=(y*image.width+x)*4;
        image.data[offset]=image.data[offset+1]=image.data[offset+2]=0x00;
        image.data[offset+3]=0xff;
        break;
      }
    }
  }
}
export function drawOutlineFont(image,x0,y0,w,h,operList){
  var cx=0,cy=0,lines=[];
  var handler=[
    (param)=>{ //0
      cx=param.x1;
      cy=param.y1;
      let offset=(cy*image.width+cx)*4;
      image.data[offset+2]=0xff;
      image.data[offset+3]=0xff;
    },
    (param)=>{ //1
      if(param.x1!=cx){
        lines.push({x0:cx,y0:cy,x1:param.x1,y1:cy});
      }
      cx=param.x1;
    },
    (param)=>{ //2
      if(param.y1!=cy){
        lines.push({x0:cx,y0:cy,x1:cx,y1:param.y1});
      }
      cy=param.y1;
    },
    (param)=>{ //3
      if(param.x1!=cx||param.y1!=cy){
        lines.push({x0:cx,y0:cy,x1:param.x1,y1:param.y1});
      }
      cx=param.x1;
      cy=param.y1;
    },
    (param)=>{ //4
      lines=lines.concat(linesBezier2(cx,cy,param.x1,param.y1,param.x2,param.y2));
      cx=param.x2;
      cy=param.y2;
    },
    (param)=>{ //5
      lines=lines.concat(linesBezier3(cx,cy,param.x1,param.y1,param.x2,param.y2,param.x3,param.y3));
      cx=param.x3;
      cy=param.y3;
    },
    (param)=>{ //6
      if(param.x1!=param.x2 && param.y1!=param.y2){
        lines.push({x0:param.x1,y0:param.y1,x1:param.x2,y1:param.y1});
        lines.push({x0:param.x1,y0:param.y2,x1:param.x2,y1:param.y2});
        lines.push({x0:param.x1,y0:param.y1,x1:param.x1,y1:param.y2});
        lines.push({x0:param.x2,y0:param.y1,x1:param.x2,y1:param.y2});
      }
    },
    (param)=>{ //7
      if(param.dx1){
        lines.push({
          x0:cx,
          y0:cy,
          x1:cx+param.dx1,
          y1:param.y1,
        });
      }
      cx+=param.dx1;
      cy=param.y1;
    },
    (param)=>{ //8
      if(param.dy1){
        lines.push({x0:cx,y0:cy,x1:param.x1,y1:cy+param.dy1});
      }
      cx=param.x1;
      cy+=param.dy1;
    },
    (param)=>{ //9
      if(param.dx1||param.dy1){
        lines.push({x0:cx,y0:cy,x1:cx+param.dx1,y1:cy+param.dy1});
      }
      cx+=param.dx1;
      cy+=param.dy1;
    },
    (param)=>{ //10
      if(param.dx1||param.dy1){
        lines.push({x0:cx,y0:cy,x1:cx+param.dx1,y1:cy+param.dy1});
      }
      cx+=param.dx1;
      cy+=param.dy1;
    },
    (param)=>{ //11
      let _dx1=param.dx1;
      let _dy1=param.dy1;
      let _dx2=param.dx1+param.dx2;
      let _dy2=param.dy1+param.dy2;
      lines=lines.concat(linesBezier2(cx,cy,cx+_dx1,cy+_dy1,cx+_dx2,cy+_dy2));
      cx+=_dx2;
      cy+=_dy2;
    },
    (param)=>{ //12
      let _dx1=param.dx1;
      let _dy1=param.dy1;
      let _dx2=param.dx1+param.dx2;
      let _dy2=param.dy1+param.dy2;
      lines=lines.concat(linesBezier2(cx,cy,cx+_dx1,cy+_dy1,cx+_dx2,cy+_dy2));
      cx+=_dx2;
      cy+=_dy2;
    },
    (param)=>{ //13
      let _dx1=param.dx1;
      let _dy1=param.dy1;
      let _dx2=param.dx1+param.dx2;
      let _dy2=param.dy1+param.dy2;
      let _dx3=param.dx1+param.dx2+param.dx3;
      let _dy3=param.dy1+param.dy2+param.dy3;
      lines=lines.concat(linesBezier3(cx,cy,cx+_dx1,cy+_dy1,cx+_dy2,cy+_dy2,cx+_dy3,cy+_dy3));
      cx+=_dx3;
      cy+=_dy3;
    },
    (param)=>{ //14
      let _dx1=param.dx1;
      let _dy1=param.dy1;
      let _dx2=param.dx1+param.dx2;
      let _dy2=param.dy1+param.dy2;
      let _dx3=param.dx1+param.dx2+param.dx3;
      let _dy3=param.dy1+param.dy2+param.dy3;
      lines=lines.concat(linesBezier3(cx,cy,cx+_dx1,cy+_dy1,cx+_dy2,cy+_dy2,cx+_dy3,cy+_dy3));
      cx+=_dx3;
      cy+=_dy3;
    },
  ];
  for(let item of operList){
    if(!handler[item.oper]){
      console.error('Unknown operation:',item.oper);
      continue;
    }
    if(item.oper>7){
      console.log(item);
    }
    handler[item.oper](item.param);
  }

  for(let line of lines){
    drawLine(image,x0+line.x0,y0+line.y0,x0+line.x1,y0+line.y1);
  }

  /*
  for(let y=0;y<h;y++){
    let lineCuts=horFill(image,y,lines);
  }
  */
}
