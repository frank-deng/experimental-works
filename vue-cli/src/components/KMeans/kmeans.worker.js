'use strict'
var KMeans = function(targets, src){
  this.targets = targets.slice();
  this.src = src;
};
KMeans.prototype = {
  constructor: KMeans,
  getMinDistance: function(targets, vec) {
    var len = targets.length;
    var imin, min = undefined;
    for (var i = 0; i < len; i++) {
      var target = targets[i];
      var d0 = vec[0] - target[0];
      var d1 = vec[1] - target[1];
      var d2 = vec[2] - target[2];
      var distance = d0 * d0 + d1 * d1 + d2 * d2;
      if (undefined === min || distance < min) {
        min = distance;
        imin = i;
      }
    }
    return imin;
  },
  getCentroids: function(centroids, src) {
    var count = new Array(centroids.length);
    var centroidsNew = new Array();

    for (var i = 0; i < centroids.length; i++) {
      centroidsNew.push([0, 0, 0].slice());
      count[i] = 0;
    }

    //Calculate centroids
    var srcLen = src.length;
    for (var i = 0; i < srcLen; i++) {
      var vec = src[i];
      var idxMinDist = this.getMinDistance(centroids, vec);
      centroidsNew[idxMinDist][0] += vec[0];
      centroidsNew[idxMinDist][1] += vec[1];
      centroidsNew[idxMinDist][2] += vec[2];
      count[idxMinDist] += 1;
    }

    //Calculate Delta
    var delta = 0;
    for (var i = 0; i < centroidsNew.length; i++) {
      if (count[i]) {
        centroidsNew[i][0] /= count[i];
        centroidsNew[i][1] /= count[i];
        centroidsNew[i][2] /= count[i];
      }

      var n0 = centroidsNew[i][0] - centroids[i][0];
      var n1 = centroidsNew[i][1] - centroids[i][1];
      var n2 = centroidsNew[i][2] - centroids[i][2];
      delta += n0*n0 + n1*n1 + n2*n2;
    }
    delta /= centroidsNew.length * 3

    return {
      result: centroidsNew,
      delta: delta,
    };
  },
  getOptimizedPalette(delta0, times0){
    var times = (undefined !== times0 ? times0 : 32);
    var minDelta = (undefined !== delta0 ? delta0 : 0.1);
    var delta = 0;
    var targets = this.targets;
    while(times--) {
      var centroids = this.getCentroids(targets, this.src);
      targets = centroids.result;
      if (centroids.delta < minDelta) {
        break;
      }
    }

    //Convert targets to integer
    for (var i = 0; i < targets.length; i++) {
      var target = targets[i];
      for (var j = 0; j < target.length; j++) {
        targets[i][j] = Math.round(target[j]);
      }
    }

    return targets;
  },
  getMap: function(targets, src){
    var srcLen = src.length, result = [];
    for (var i = 0; i < srcLen; i++) {
      var idxMinDist = this.getMinDistance(targets, src[i]);
      result.push(targets[idxMinDist].slice());
    }
    return result;
  },
  getMapDither: function(targets, src, w, h){
    var srcLen = src.length, result = [];
    for (var i = 0; i < srcLen; i++) {
      result.push(src[i].slice());
    }
    for (var y=0;y<h;y++){
      for (var x=0;x<w;x++){
        var oldPixel=result[y*w+x].slice();
        var newPixel=targets[this.getMinDistance(targets, oldPixel)].slice();
        result[y*w+x]=newPixel;
        var error = [
          oldPixel[0]-newPixel[0],
          oldPixel[1]-newPixel[1],
          oldPixel[2]-newPixel[2],
        ];
        if (x+1<w){
          var pixel = result[y*w+x+1];
          pixel[0]=Math.round(pixel[0]+error[0]*7/16);
          pixel[1]=Math.round(pixel[1]+error[1]*7/16);
          pixel[2]=Math.round(pixel[2]+error[2]*7/16);
        }
        if (x-1>0 && y+1<h){
          var pixel = result[(y+1)*w+x-1];
          pixel[0]=Math.round(pixel[0]+error[0]*3/16);
          pixel[1]=Math.round(pixel[1]+error[1]*3/16);
          pixel[2]=Math.round(pixel[2]+error[2]*3/16);
        }
        if (y+1<h){
          var pixel = result[(y+1)*w+x];
          pixel[0]=Math.round(pixel[0]+error[0]*5/16);
          pixel[1]=Math.round(pixel[1]+error[1]*5/16);
          pixel[2]=Math.round(pixel[2]+error[2]*5/16);
        }
        if (x+1<w && y+1<h){
          var pixel = result[(y+1)*w+x+1];
          pixel[0]=Math.round(pixel[0]+error[0]*1/16);
          pixel[1]=Math.round(pixel[1]+error[1]*1/16);
          pixel[2]=Math.round(pixel[2]+error[2]*1/16);
        }
      }
    }
    return result;
  },
  process: function(param){
    if (param.dither){
      return this.getMapDither(this.getOptimizedPalette(param.delta,param.times), this.src, param.w, param.h);
    } else {
      return this.getMap(this.getOptimizedPalette(param.delta,param.times), this.src, param.w, param.h);
    }
  },
};

function imageData2vectorList(imageData) {
	var result = new Array();
	var count = imageData.width * imageData.height;
	var pixelData = imageData.data;
	for (var i = 0; i < count; i++) {
		result.push([pixelData[4*i], pixelData[4*i+1], pixelData[4*i+2]]);
	}
	return result;
}
function writeVectorList(imageData, vectorList) {
	var count = imageData.width * imageData.height;
	for (var i = 0; i < count; i++) {
		imageData.data[i*4] = vectorList[i][0];
		imageData.data[i*4+1] = vectorList[i][1];
		imageData.data[i*4+2] = vectorList[i][2];
	}
}
var initPoints=[];
for(var i=0;i<27;i++){
	let values=[0x00,0x7f,0xff];
	initPoints.push([
		values[Math.floor(i/9)%3],
		values[Math.floor(i/3)%3],
		values[i%3],
	]);
}
self.addEventListener('message', function(msg){
	var imageData = msg.data.imageData;
	var vectorList = imageData2vectorList(msg.data.imageData);
	var kMeans = new KMeans(initPoints, vectorList);
	var result = kMeans.process({
    w:imageData.width,
    h:imageData.height,
    dither:msg.data.dither,
  });
	writeVectorList(msg.data.imageData, result);
	self.postMessage({imageData: msg.data.imageData});
});


