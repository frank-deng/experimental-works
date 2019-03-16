import {saveAs} from 'file-saver'
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

export default{
  install(Vue){
    Vue.prototype.$saveAs = function(target, fileName=null, extension='', title=''){
      return new Promise((resolve,reject)=>{
        //已输入过文件名
        if(fileName){
          resolve(fileName);
          saveAs(target, fileName);
          return;
        }

        //未输入过文件名
        this.$prompt('请输入文件名：', title, {
          closeOnClickModal:false,
          center:true,
          roundButton:true,
        }).then(({value})=>{
          saveAs(target, `${value}${extension}`);
          resolve(value);
        });
      });
    }
  }
}
