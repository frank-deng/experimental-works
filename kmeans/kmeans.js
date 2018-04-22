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
		getMap: function(targets, src) {
			var srcLen = src.length, result = [];
			for (var i = 0; i < srcLen; i++) {
				var idxMinDist = this.getMinDistance(targets, src[i]);
				result.push(targets[idxMinDist].slice());
			}
			return result;
		},
		process: function(delta0, times0) {
			var times = (undefined !== times0 ? times0 : 8);
			var minDelta = (undefined !== delta0 ? delta0 : 8);
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
			return this.getMap(targets, this.src);
		},
	};
    return KMeans;
}));
