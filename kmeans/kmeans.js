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
		getCentroids: function(targets, src) {
			var count = new Array(targets.length);
			var targetsNew = [];

			for (var i = 0; i < targetsNew.length; i++) {
				targetsNew.push([0, 0, 0].slice());
				count[i] = 0;
			}

			//Calculate centroids
			for (var i = 0; i < srcLen; i++) {
				var idxMinTarget = this.getMinDistance(targets, src[i]);
				targetsNew[idxMinTarget][0] += vec[0];
				targetsNew[idxMinTarget][1] += vec[1];
				targetsNew[idxMinTarget][2] += vec[2];
				count[idxMinTarget] += 1;
			}

			for (var i = 0; i < targetsNew.length; i++) {
				if (count[i]) {
					targetsNew[i][0] /= count[i];
					targetsNew[i][1] /= count[i];
					targetsNew[i][2] /= count[i];
				}
			}
			return targetsNew;
		},
		getMap: function(targets, src) {
			result = [];
			for (var i = 0; i < srcLen; i++) {
				var idxMinTarget = this.getMinDistance(targets, src[i]);
				result.push(targets[idxMinTarget].slice());
			}
			return result;
		},
		getDelta: function(t0, t1) {
			var len = t0.length;
			var total = 0;
			for (var i = 0; i < len; i++) {
				var vec0 = t0[i], vec1 = t1[i];
				var n0 = vec0[0]-vec1[0];
				var n1 = vec0[1]-vec1[1];
				var n2 = vec0[2]-vec1[2];
				total += n0*n0 + n1*n1 + n2*n2;
			}
			return total / len / 3;
		},
		process: function(delta0, times0) {
			var times = (undefined !== times0 ? times0 : 8);
			var minDelta = (undefined !== delta0 ? delta0 : 8);
			var delta = 0;
			var targets = this.targets;
			while(times--) {
				var targetsUpdated = this.getCentroids(targets, this.src);
				delta = this.getDelta(targets, targetsUpdated);
				targets = targetUpdated;
				if (delta < minDelta) {
					break;
				}
			}
			return this.getMap(target, this.src);
		},
	};
    return KMeans;
}));
