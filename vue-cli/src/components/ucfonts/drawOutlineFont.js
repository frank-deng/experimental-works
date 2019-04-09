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
var drawLine=function(image,x0,y0,x1,y1,color){
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
      image.data[offset]=image.data[offset+1]=image.data[offset+2]=color?0xff:0x00;
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
var horFill=function(image,_x0,_y0,w,y,lines,color){
  let lineCuts=[];
  for(let line of lines){
    let x0=line.x0,y0=line.y0-0.1,x1=line.x1,y1=line.y1-0.1;
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
  for(let x=0;x<w;x++){
    for(let i=0;i<lineCuts.length;i+=2){
      if(x>=lineCuts[i] && x<lineCuts[i+1]){
        if((x+_x0)<0 || (x+_x0)>=image.width || (y+_y0)<0 || (y+_y0)>=image.height){
          continue;
        }
        let offset=((y+_y0)*image.width+(x+_x0))*4;
        image.data[offset]=image.data[offset+1]=image.data[offset+2]=color?0xff:0x00;
        image.data[offset+3]=0xff;
        break;
      }
    }
  }
}

var lineCrossed=function(x0,y0,x1,y1,x2,y2,x3,y3){
  let a0=y1-y0,b0=x0-x1,c0=x0*y1-x1*y0;
  let a1=y3-y2,b1=x2-x3,c1=x2*y3-x3*y2;
  let det=a0*b1-a1*b0;
  if(0==det){
    return null;
  }
  let cx=(c0*b1-c1*b0)/det,cy=(a0*c1-a1*c0)/det;
  if((Math.abs(cx-(x0+x1)/2) <= Math.abs(x1-x0)/2) &&
     (Math.abs(cy-(y0+y1)/2) <= Math.abs(y1-y0)/2) &&
     (Math.abs(cx-(x2+x3)/2) <= Math.abs(x3-x2)/2) &&
     (Math.abs(cy-(y2+y3)/2) <= Math.abs(y3-y2)/2)){
    return[cx,cy];
  }else{
    return null;
  }
}
var conflictDetect=function(lines0,lines1,rect0,rect1){
  if(rect0&&rect1){
    if(rect0.x1<rect1.x0 && rect1.x1<rect0.x0 && rect0.y1<rect1.y0 && rect1.y1<rect0.y0){
      return false;
    }
  }
  for(let a of lines0){
    for(let b of lines1){
      if(lineCrossed(
          a.x0,a.y0,a.x1,a.y1,
          b.x0,b.y0,b.x1,b.y1
        )){
        return true;
      }
    }
  }
  return false;
}
var getLinesRect=function(lines){
  let x0=null,y0=null,x1=0,y1=0;
  for(let line of lines){
    if(null===x0 || x0>line.x0){
      x0=line.x0;
    }
    if(null===x0 || x0>line.x1){
      x0=line.x1;
    }
    if(x1<line.x0){
      x1=line.x0;
    }
    if(x1<line.x1){
      x1=line.x1;
    }
    if(null===y0 || y0>line.y0){
      y0=line.y0;
    }
    if(null===y0 || y0>line.y1){
      y0=line.y1;
    }
    if(y1<line.y0){
      y1=line.y0;
    }
    if(y1<line.y1){
      y1=line.y1;
    }
  }
  return {x0:x0,y0:y0,x1:x1,y1:y1};
}
var isolatedLineGrps=function(linesGrp){
  let rectGrp=linesGrp.map((n)=>getLinesRect(n));
  let result=[],remain=linesGrp.slice();
  for(let i=0;i<remain.length;i++){
    if(undefined===remain[i]){
      continue;
    }
    let group=linesGrp[i];
    for(let j=i+1;j<remain.length;j++){
      if(undefined===remain[j]){
        continue;
      }
      if(conflictDetect(linesGrp[i],linesGrp[j],rectGrp[i],rectGrp[j])){
        group=group.concat(linesGrp[j]);
        remain[i]=remain[j]=undefined;
      }
    }
    if(remain[i]){
      result.push(i);
    }
  }
  return result;
}
export function drawOutlineFont(image,x0,y0,w,h,operList,color){
  var cx=0,cy=0,lines=[],linesGrp=[lines],linesOrig=[],linesGrpOrig=[linesOrig];
  var newGroup=()=>{
    if(lines.length){
      lines=[];
      linesGrp.push(lines);
      linesOrig=[];
      linesGrpOrig.push(linesOrig);
    }
  }
  var handler=[
    (param)=>{ //0
      newGroup();
      cx=param.x1;
      cy=param.y1;
    },
    (param)=>{ //1
      let lineParam={
        x0:Math.round(cx*w/BASE_WIDTH),
        y0:Math.round(cy*h/BASE_HEIGHT),
        x1:Math.round(param.x1*w/BASE_WIDTH),
        y1:Math.round(cy*h/BASE_HEIGHT),
      };
      if(lineParam.x0!=lineParam.x1){
        lines.push(lineParam);
        linesOrig.push({x0:cx,y0:cy,x1:param.x1,y1:cy});
      }
      cx=param.x1;
    },
    (param)=>{ //2
      let lineParam={
        x0:Math.round(cx*w/BASE_WIDTH),
        y0:Math.round(cy*h/BASE_HEIGHT),
        x1:Math.round(cx*w/BASE_WIDTH),
        y1:Math.round(param.y1*h/BASE_HEIGHT),
      };
      if(lineParam.y0!=lineParam.y1){
        lines.push(lineParam);
        linesOrig.push({x0:cx,y0:cy,x1:cx,y1:param.y1});
      }
      cy=param.y1;
    },
    (param)=>{ //3
      let lineParam={
        x0:Math.round(cx*w/BASE_WIDTH),
        y0:Math.round(cy*h/BASE_HEIGHT),
        x1:Math.round(param.x1*w/BASE_WIDTH),
        y1:Math.round(param.y1*h/BASE_HEIGHT),
      };
      if(lineParam.x0!=lineParam.x1 || lineParam.y0!=lineParam.y1){
        lines.push(lineParam);
        linesOrig.push({x0:cx,y0:cy,x1:param.x1,y1:param.y1});
      }
      cx=param.x1;
      cy=param.y1;
    },
    (param)=>{ //4
      let blines=linesBezier2(
        Math.round(cx*w/BASE_WIDTH),
        Math.round(cy*h/BASE_HEIGHT),
        Math.round(param.x1*w/BASE_WIDTH),
        Math.round(param.y1*h/BASE_HEIGHT),
        Math.round(param.x2*w/BASE_WIDTH),
        Math.round(param.y2*h/BASE_HEIGHT),
      );
      for(let item of blines){
        lines.push(item);
      }
      let blinesOrig=linesBezier2(cx,cy,param.x1,param.y1,param.x2,param.y2);
      for(let item of blinesOrig){
        linesOrig.push(item);
      }
      cx=param.x2;
      cy=param.y2;
    },
    (param)=>{ //5
      let blines=linesBezier3(
        Math.round(cx*w/BASE_WIDTH),
        Math.round(cy*h/BASE_HEIGHT),
        Math.round(param.x1*w/BASE_WIDTH),
        Math.round(param.y1*h/BASE_HEIGHT),
        Math.round(param.x2*w/BASE_WIDTH),
        Math.round(param.y2*h/BASE_HEIGHT),
        Math.round(param.x3*w/BASE_WIDTH),
        Math.round(param.y3*h/BASE_HEIGHT),
      );
      for(let item of blines){
        lines.push(item);
      }
      let blinesOrig=linesBezier3(cx,cy,param.x1,param.y1,param.x2,param.y2,param.x3,param.y3);
      for(let item of blinesOrig){
        linesOrig.push(item);
      }
      cx=param.x3;
      cy=param.y3;
    },
    (param)=>{ //6
      let x0=Math.round(param.x1*w/BASE_WIDTH),
        y0=Math.round(param.y1*h/BASE_HEIGHT),
        x1=Math.round(param.x2*w/BASE_WIDTH),
        y1=Math.round(param.y2*h/BASE_HEIGHT);
      if(x0==x1 || y0==y1){
        return;
      }
      linesGrp.unshift([
        {x0:x0,x1:x1,y0:y0,y1:y0},
        {x0:x0,x1:x0,y0:y0,y1:y1},
        {x0:x1,x1:x1,y0:y0,y1:y1},
        {x0:x0,x1:x1,y0:y1,y1:y1},
      ]);
      x0=param.x1;
      y0=param.y1;
      x1=param.x2;
      y1=param.y2;
      linesGrpOrig.unshift([
        {x0:x0,x1:x1,y0:y0,y1:y0},
        {x0:x0,x1:x0,y0:y0,y1:y1},
        {x0:x1,x1:x1,y0:y0,y1:y1},
        {x0:x0,x1:x1,y0:y1,y1:y1},
      ]);
    },
    (param)=>{ //7
      if(param.dx1){
        lines.push({
          x0:Math.round(cx*w/BASE_WIDTH),
          y0:Math.round(cy*h/BASE_HEIGHT),
          x1:Math.round((cx+param.dx1)*w/BASE_WIDTH),
          y1:Math.round(param.y1*h/BASE_HEIGHT),
        });
        linesOrig.push({
          x0:cx,
          y0:cy,
          x1:(cx+param.dx1),
          y1:param.y1,
        });
      }
      cx+=param.dx1;
      cy=param.y1;
    },
    (param)=>{ //8
      if(param.dy1){
        lines.push({
          x0:Math.round(cx*w/BASE_WIDTH),
          y0:Math.round(cy*h/BASE_HEIGHT),
          x1:Math.round(param.x1*w/BASE_WIDTH),
          y1:Math.round((cy+param.dy1)*h/BASE_HEIGHT),
        });
        linesOrig.push({
          x0:cx,
          y0:cy,
          x1:param.x1,
          y1:(cy+param.dy1),
        });
      }
      cx=param.x1;
      cy+=param.dy1;
    },
    (param)=>{ //9
      if(param.dx1||param.dy1){
        lines.push({
          x0:Math.round(cx*w/BASE_WIDTH),
          y0:Math.round(cy*h/BASE_HEIGHT),
          x1:Math.round((cx+param.dx1)*w/BASE_WIDTH),
          y1:Math.round((cy+param.dy1)*h/BASE_HEIGHT),
        });
        linesOrig.push({
          x0:cx,
          y0:cy,
          x1:(cx+param.dx1),
          y1:(cy+param.dy1),
        });
      }
      cx+=param.dx1;
      cy+=param.dy1;
    },
    (param)=>{ //10
      if(param.dx1||param.dy1){
        lines.push({
          x0:Math.round(cx*w/BASE_WIDTH),
          y0:Math.round(cy*h/BASE_HEIGHT),
          x1:Math.round((cx+param.dx1)*w/BASE_WIDTH),
          y1:Math.round((cy+param.dy1)*h/BASE_HEIGHT),
        });
        linesOrig.push({
          x0:cx,
          y0:cy,
          x1:(cx+param.dx1),
          y1:(cy+param.dy1),
        });
      }
      cx+=param.dx1;
      cy+=param.dy1;
    },
    (param)=>{ //11
      let _dx1=param.dx1;
      let _dy1=param.dy1;
      let _dx2=param.dx1+param.dx2;
      let _dy2=param.dy1+param.dy2;
      let blines=linesBezier2(
        Math.round(cx*w/BASE_WIDTH),
        Math.round(cy*h/BASE_HEIGHT),
        Math.round((cx+_dx1)*w/BASE_WIDTH),
        Math.round((cy+_dy1)*h/BASE_HEIGHT),
        Math.round((cx+_dx2)*w/BASE_WIDTH),
        Math.round((cy+_dy2)*h/BASE_HEIGHT),
      );
      for(let item of blines){
        lines.push(item);
      }
      let blinesOrig=linesBezier2(cx,cy,(cx+_dx1),(cy+_dy1),(cx+_dx2),(cy+_dy2));
      for(let item of blinesOrig){
        linesOrig.push(item);
      }
      cx+=_dx2;
      cy+=_dy2;
    },
    (param)=>{ //12
      let _dx1=param.dx1;
      let _dy1=param.dy1;
      let _dx2=param.dx1+param.dx2;
      let _dy2=param.dy1+param.dy2;
      let blines=linesBezier2(
        Math.round(cx*w/BASE_WIDTH),
        Math.round(cy*h/BASE_HEIGHT),
        Math.round((cx+_dx1)*w/BASE_WIDTH),
        Math.round((cy+_dy1)*h/BASE_HEIGHT),
        Math.round((cx+_dx2)*w/BASE_WIDTH),
        Math.round((cy+_dy2)*h/BASE_HEIGHT),
      );
      for(let item of blines){
        lines.push(item);
      }
      let blinesOrig=linesBezier2(cx,cy,(cx+_dx1),(cy+_dy1),(cx+_dx2),(cy+_dy2));
      for(let item of blinesOrig){
        linesOrig.push(item);
      }
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
      let blines=linesBezier3(
        Math.round(cx*w/BASE_WIDTH),
        Math.round(cy*h/BASE_HEIGHT),
        Math.round((cx+_dx1)*w/BASE_WIDTH),
        Math.round((cy+_dy1)*h/BASE_HEIGHT),
        Math.round((cx+_dx2)*w/BASE_WIDTH),
        Math.round((cy+_dy2)*h/BASE_HEIGHT),
        Math.round((cx+_dx3)*w/BASE_WIDTH),
        Math.round((cy+_dy3)*h/BASE_HEIGHT),
      );
      for(let item of blines){
        lines.push(item);
      }
      let blinesOrig=linesBezier2(cx,cy,(cx+_dx1),(cy+_dy1),(cx+_dx2),(cy+_dy2),(cx+_dx3),(cy+_dy3));
      for(let item of blinesOrig){
        linesOrig.push(item);
      }
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
      let blines=linesBezier3(
        Math.round(cx*w/BASE_WIDTH),
        Math.round(cy*h/BASE_HEIGHT),
        Math.round((cx+_dx1)*w/BASE_WIDTH),
        Math.round((cy+_dy1)*h/BASE_HEIGHT),
        Math.round((cx+_dx2)*w/BASE_WIDTH),
        Math.round((cy+_dy2)*h/BASE_HEIGHT),
        Math.round((cx+_dx3)*w/BASE_WIDTH),
        Math.round((cy+_dy3)*h/BASE_HEIGHT),
      );
      for(let item of blines){
        lines.push(item);
      }
      let blinesOrig=linesBezier2(cx,cy,(cx+_dx1),(cy+_dy1),(cx+_dx2),(cy+_dy2),(cx+_dx3),(cy+_dy3));
      for(let item of blinesOrig){
        linesOrig.push(item);
      }
      cx+=_dx3;
      cy+=_dy3;
    },
    ()=>{ //15
    },
  ];
  for(let item of operList){
    handler[item.oper](item.param);
  }

  //寻找孤立的笔画，然后把他们放一起
  let isolatedLines=[];
  for(let i of isolatedLineGrps(linesGrpOrig)){
    isolatedLines=isolatedLines.concat(linesGrp[i]);
    linesGrp[i]=null;
  }
  linesGrp.unshift(isolatedLines);

  let bx0=null,bx1=null;
  for(let lines of linesGrp){
    if(!Array.isArray(lines) || 0==lines.length){
      continue;
    }
    for(let y=0;y<h;y++){
      horFill(image,x0,y0,w,y,lines,color);
    }
    for(let line of lines){
      drawLine(image,x0+line.x0,y0+line.y0,x0+line.x1,y0+line.y1,color);
      //获取本字符的绑定边框
      if(null===bx0||line.x0<bx0){
        bx0=line.x0;
      }
      if(null===bx1||line.x0>bx1){
        bx1=line.x0;
      }
      if(null===bx0||line.x1<bx0){
        bx0=line.x1;
      }
      if(null===bx1||line.x1>bx1){
        bx1=line.x1;
      }
    }
  }
  return[bx0,bx1];
}
