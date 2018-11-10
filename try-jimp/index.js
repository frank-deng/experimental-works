const JIMP = require('jimp');

const srcFile = process.argv[2];
const destFile = process.argv[3] || 'output.png';
if (undefined === srcFile){
	console.error('Source file not specified.');
	process.exit(1);
}
