export default {
	loadSound: function(filename, method='GET') {
		return new Promise((resolve, reject)=>{
			var request = new XMLHttpRequest();
			request.open(method, filename);
			request.responseType = 'arraybuffer';
			request.onload = function(){
				resolve(this.response);
			}
			request.onerror = function(e){
				reject('error');
			}
			request.ontimeout = function(e){
				reject('timeout');
			}
			request.send();
		}).then((resp)=>{
		});
	}
}
