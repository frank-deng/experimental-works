function rgb2hex(r,g,b){
	return ('00'+r.toString(16)).slice(-2)
		+ ('00'+g.toString(16)).slice(-2)
		+ ('00'+b.toString(16)).slice(-2);
}
function hex2rgb(str){
	return {
		r: parseInt(str.slice(0, 2), 16),
		g: parseInt(str.slice(2, 4), 16),
		b: parseInt(str.slice(4, 6), 16),
	};
}
self.addEventListener('message', function(msg){
	let colorDist = {}, imgData = msg.data.imgData;
	let count = imgData.width * imgData.height;
	for (let i = 0; i < count; i++){
		let hex = rgb2hex(imgData.data[4*i], imgData.data[4*i+1], imgData.data[4*i+2]);
		if (colorDist[hex]) {
			colorDist[hex]++;
		} else {
			colorDist[hex] = 1;
		}
	}
	self.postMessage({colorDist: colorDist});
});

