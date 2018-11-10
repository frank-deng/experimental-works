const Jimp = require('jimp');
const fitRect = require('./fit-rect');

const srcFile = process.argv[2];
const destFile = process.argv[3] || '1.png';
if (undefined === srcFile){
	console.error('Source file not specified.');
	process.exit(1);
}

Jimp.read(srcFile).then((image)=>{
	let size = fitRect(640,400,image.bitmap.width,image.bitmap.height);
	image.resize(size.width,size.height).grayscale().write(destFile);
}).catch((e)=>{
	if(e){throw e}
});

