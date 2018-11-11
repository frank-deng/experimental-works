(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD support.
        define([], factory);
    } else if (typeof exports === 'object') {
        // NodeJS support.
        module.exports = factory();
    } else {
        // Browser global support.
        root.KMeans = factory();
    }
}(this, function() {
    'use strict';
	var getMinDistance = function(targets, vec) {
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
	}
	var getCentroids = function(centroids, src) {
		var count = new Array(centroids.length);
		var centroidsNew = new Array();

		for (var i = 0; i < centroids.length; i++) {
			centroidsNew.push([0, 0, 0].slice());
			count[i] = 0;
		}

		//Calculate centroids
		let len = src.length;
		for (let i=0; i<len; i+=4) {
			let idxMinDist = getMinDistance(centroids, [src[i], src[i+1], src[i+2]]);
			count[idxMinDist] += 1;
			centroidsNew[idxMinDist][0] += src[i];
			centroidsNew[idxMinDist][1] += src[i+1];
			centroidsNew[idxMinDist][2] += src[i+2];
		}

		//Calculate Delta
		let delta = 0;
		for (var i = 0; i < centroidsNew.length; i++) {
			if (count[i] > 0) {
				centroidsNew[i][0] /= count[i];
				centroidsNew[i][1] /= count[i];
				centroidsNew[i][2] /= count[i];
			} else {
				centroidsNew[i][0] = 0;
				centroidsNew[i][1] = 0;
				centroidsNew[i][2] = 0;
			}

			let n0 = centroidsNew[i][0] - centroids[i][0];
			let n1 = centroidsNew[i][1] - centroids[i][1];
			let n2 = centroidsNew[i][2] - centroids[i][2];
			delta += n0*n0 + n1*n1 + n2*n2;
		}
		delta /= centroidsNew.length * 3
		centroidsNew.delta = delta;
		return centroidsNew;
	}
	var getOptimizedPalette = function(initialPalette, matrix, minDelta=0.1, times=32){
		let centroids = getCentroids(initialPalette, matrix);
		console.log(times, centroids.length, centroids.delta);
		while(times-- && centroids.delta > minDelta) {
			centroids = getCentroids(initialPalette, matrix);
			console.log(times, centroids.length, centroids.delta);
		}

		//Convert centroids to integer
		for (let vec of centroids) {
			for (let i = 0; i < vec.length; i++) {
				vec[i] = Math.round(vec[i]);
			}
		}
		return centroids;
	}
	var getMap = function(targets, src){
		let result = src.slice();
		for (let i=0; i<src.length; i+=4) {
			let vec = targets[getMinDistance(targets, [src[i],src[i+1],src[i+2]])];
			result[i]=vec[0];
			result[i+1]=vec[1];
			result[i+2]=vec[2];
		}
		return result;
	}
	var getMapDither = function(targets, src, w, h){
		var srcLen = src.length, result = [];
		for (var i = 0; i < srcLen; i++) {
			result.push(src[i].slice());
		}
		for (var y=0;y<h;y++){
			for (var x=0;x<w;x++){
				var oldPixel=result[y*w+x].slice();
				var newPixel=targets[getMinDistance(targets, oldPixel)].slice();
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
	}
    return {
		getOptimizedPalette,
		getMap,
		getMapDither,
	};
}));
