import iconv from 'iconv-lite';

let fontData16 = {};
let fontData12 = {};

//Load asc16.fon
let fontBuf = Buffer.from(require('@/assets/asc16.fon').split(',')[1], 'base64');
let dataView = new DataView(fontBuf.buffer);
let iconvBuf=Buffer.from([0]);
for(let c=0;c<=0xff;c++){
  let charFontData = new Uint8Array(16);
  for(let i=0;i<16;i++){
    charFontData[i]=dataView.getUint8(c*16+i);
  }
  iconvBuf[0]=c;
  let charCodeStr = iconv.decode(iconvBuf,'cp437').charCodeAt(0).toString(16);
  fontData16[charCodeStr] = {
    wide:false,data:charFontData,
  }
}

//Load hzk16.fon
fontBuf = Buffer.from(require('@/assets/hzk16.fon').split(',')[1], 'base64');
dataView = new DataView(fontBuf.buffer);
iconvBuf=Buffer.from([0,0]);
for(let qu=0xa1;qu<=0xf7;qu++){
  for(let wei=0xa1;wei<=0xfe;wei++){
    let charFontData = new Uint16Array(16);
    for(let i=0;i<16;i++){
      let addr = (qu-0xa1)*94+(wei-0xa1);
      charFontData[i]=dataView.getUint16(addr*32+i*2);
    }
    iconvBuf[0]=qu;
    iconvBuf[1]=wei;
    let charCodeStr = iconv.decode(iconvBuf,'gbk').charCodeAt(0).toString(16);
    fontData16[charCodeStr] = {
      wide:true,data:charFontData,
    }
  }
}

//Load asc12.fon
fontBuf = Buffer.from(require('@/assets/asc12.fon').split(',')[1], 'base64');
dataView = new DataView(fontBuf.buffer);
iconvBuf=Buffer.from([0]);
for(let c=0x20;c<=0x7e;c++){
  let charFontData = new Uint16Array(12);
  let offset=(c-0x20)*12;
  for(let i=0;i<12;i++){
    charFontData[i]=(dataView.getUint8(offset+i)<<8);
  }
  fontData12[c.toString(16)] = {
    wide:false,data:charFontData,
  }
}

//Load hzk12.fon
fontBuf = Buffer.from(require('@/assets/hzk12.fon').split(',')[1], 'base64');
dataView = new DataView(fontBuf.buffer);
iconvBuf=Buffer.from([0,0]);
for(let qu=0xa1;qu<=0xf7;qu++){
  for(let wei=0xa1;wei<=0xfe;wei++){
    let charFontData = new Uint16Array(12);
    for(let i=0;i<12;i++){
      let addr = (qu-0xa1)*94+(wei-0xa1);
      charFontData[i]=dataView.getUint16(addr*24+i*2);
    }
    iconvBuf[0]=qu;
    iconvBuf[1]=wei;
    let charCodeStr = iconv.decode(iconvBuf,'gbk').charCodeAt(0).toString(16);
    fontData12[charCodeStr] = {
      wide:true,data:charFontData,
    }
  }
}

export function getFont16(c){
  return fontData16[c.charCodeAt(0).toString(16)];
}
export function getFont12(c){
  return fontData12[c.charCodeAt(0).toString(16)];
}

export function strlen2(str){
  let result = 0;
  for(let c of str){
    let charData = getFont16(c);
    result += (charData && charData.wide ? 2 : 1);
  }
  return result;
}

