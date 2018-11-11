const Jimp = require('jimp');

const KMeans= require('./kmeans')

const srcFile = process.argv[2];
const destFile = process.argv[3] || '1.png';
if (undefined === srcFile){
	console.error('Source file not specified.');
	process.exit(1);
}

Jimp.read(srcFile).then((image)=>{
	return image.scaleToFit(1024,1024).clone();
}).then((image)=>{
	var initPoints=[];
	for(var i=0;i<27;i++){
		let values=[0x00,0x7f,0xff];
		initPoints.push([
			values[Math.floor(i/9)%3],
			values[Math.floor(i/3)%3],
			values[i%3],
		]);
	}
	var palette = KMeans.getOptimizedPalette(initPoints, image.bitmap.data);
	console.log(palette);
	image.bitmap.data = KMeans.getMap(palette, image.bitmap.data);
	/*
	image.grayscale().convolute([
		[2,0,0],
		[0,-1,0],
		[0,0,-1],
	]).color([
		{apply:'lighten', params:[50]},
	]);
	*/
	return image;
}).then((image)=>{
	image.write(destFile);
}).catch((e)=>{
	if(e){throw e}
});

