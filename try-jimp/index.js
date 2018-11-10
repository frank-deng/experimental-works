const Jimp = require('jimp');

const srcFile = process.argv[2];
const destFile = process.argv[3] || '1.png';
if (undefined === srcFile){
	console.error('Source file not specified.');
	process.exit(1);
}

Jimp.read(srcFile).then((image)=>{
	return image.scaleToFit(1024,1024).clone();
}).then((image)=>{
	return image.grayscale().convolute([
		[2,0,0],
		[0,-1,0],
		[0,0,-1],
	]).color([
		{apply:'lighten', params:[50]},
	]);
}).then((image)=>{
	image.write(destFile);
}).catch((e)=>{
	if(e){throw e}
});

