'use strict'
importScripts('kmeans.js');
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
self.addEventListener('message', function(msg){
	var vectorList = imageData2vectorList(msg.data.imageData);
	var kMeans = new KMeans([
		[0,    0,    0],
		[0,    0,    0x7f],
		[0x7f, 0,    0],
		[0x7f, 0,    0x7f],
		[0,    0x7f, 0],
		[0,    0x7f, 0x7f],
		[0x7f, 0x7f, 0],
		[0x7f, 0x7f, 0x7f],
		[0,    0,    0xff],
		[0xff, 0,    0],
		[0xff, 0,    0xff],
		[0,    0xff, 0],
		[0,    0xff, 0xff],
		[0xff, 0xff, 0],
		[0xff, 0xff, 0xff],
	], vectorList);
	var result = kMeans.process();
	writeVectorList(msg.data.imageData, result);
	self.postMessage({imageData: msg.data.imageData});
});


