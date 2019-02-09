export function fitRect(wdest, hdest, wsrc, hsrc) {
	var ratioSrc = wsrc / hsrc, ratioDest = wdest / hdest;
	var scale = (ratioSrc > ratioDest) ? (wsrc / wdest) : (hsrc / hdest);
	return {
		width: wsrc / scale,
		height: hsrc / scale,
	};
}
export function downloadAsFile(source, filename, type){
  let blob = undefined;
  if (source instanceof Blob){
    blob = source;
  }else{
    blob = new Blob([source], {type: type||undefined});
  }
  if(window.navigator.msSaveOrOpenBlob){
    window.navigator.msSaveOrOpenBlob(blob, filename);
  }else{
    downloadDataURL((window.URL || window.webkitURL).createObjectURL(blob), filename);
  }
}
export function downloadDataURL(dataURL, filename){
  if(window.navigator.msSaveOrOpenBlob){
    let {meta, data} = dataURL.split(',');
    let {dummy, mediaType, dataFormat} = /data:([A-Za-z0-9\/]+);([A-Za-z0-9]+)/.exec(meta);
    let blob = new Blob(Buffer.from(data, dataFormat), {type:mediaType});
    window.navigator.msSaveOrOpenBlob(blob, filename);
  }else{
    let link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(dataURL);
  }
}

