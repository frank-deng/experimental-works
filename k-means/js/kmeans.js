'use-strict'
function calculateType(samples, types) {
	var samplesLen = samples.length, typesLen = types.length;
	var result = new Array(samplesLen);
	for (var i = 0; i < samplesLen; i++) {
		var sample = samples[i];
		var minDist = undefined, minType = undefined;
		for (var iType = 0; iType < typesLen; iType++) {
			var typeVal = types[iType]

			var dist = Math.abs(sample - typeVal);

			if (minDist === undefined || dist < minDist) {
				minDist = dist;
				minType = iType;
			}
		}
		result[i] = minType;
	}
	return result;
}
function calcMiddle(samples, types, marks) {
	var samplesLen = samples.length, typesLen = types.length;
	var sum = new Array(typesLen), cnt = new Array(typesLen);
	for (var i = 0; i < typesLen; i++) {
		sum[i] = cnt[i] = 0;
	}
	for (var i = 0; i < samplesLen; i++) {
		var sample = samples[i], idx = marks[i];
		sum[idx] += sample;
		cnt[idx]++;
	}

	var result = [];
	for (var i = 0; i < typesLen; i++) {
		result.push(cnt[i] ? sum[i] / cnt[i] : 0);
	}
	return result;
}

var samples = [
	0.1, 0.11, 0.12,
	0.5, 0.51, 0.52,
];
var types = [0, 1];

for (var t = 0; t < 5; t++){
	var marks = calculateType(samples, types);
	console.log(marks);
	var types = calcMiddle(samples, types, marks);
	console.log(types);
}
