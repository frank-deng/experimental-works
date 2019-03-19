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
export function extensionMatch(extension, filename){
  let extensionInside = filename.toUpperCase().indexOf(extension.toUpperCase());
  if(extensionInside >= 0 && (filename.length-extension.length) == extensionInside){
    return true;
  }
  return false;
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
          if(extensionMatch(extension, value)){
            value = value.slice(0,-extension.length);
          }
          let fileNameSave = `${value}${extension}`;
          if(target instanceof Promise){
            target.then((fileContent)=>{
              saveAs(fileContent,fileNameSave);
              resolve(true);
            }).catch((e)=>{
              reject(e);
            });
          }else{
            saveAs(target,fileNameSave);
            resolve(true);
          }
        });
      });
    }
  }
}
