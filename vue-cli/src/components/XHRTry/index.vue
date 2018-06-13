<template>
	<div>
		<el-button type='primary' @click='updateTime'>更新时间</el-button>
		<el-button type='primary' @click='doTimeout'>超时请求</el-button>
		<el-button type='primary' @click='frequentRequest'>{{timerReq ? '停止请求' : '大量请求'}}</el-button>
	</div>
</template>
<script>
var brake = 0;
setInterval(()=>{
	brake = 0;
}, 200);
XMLHttpRequest.prototype._send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(content){
	if (brake){
		return false;
	}
	this._send(content);
	brake = 1;
	return true;
}

export default{
	data(){
		return {
			time: '',
			timerReq: undefined,
		}
	},
	methods: {
		updateTime(){
			this.request('http://localhost:8081/time.do');
		},
		doTimeout(){
			this.request('http://localhost:8081/timeout.do');
		},
		frequentRequest(){
			if (this.timerReq){
				clearInterval(this.timerReq);
				this.timerReq = undefined;
			} else {
				this.timerReq = setInterval(()=>{
					this.request('http://localhost:8081/time.do');
				}, 1);
			}
		},
		request(url){
			var vm = this;
			var xhr = new XMLHttpRequest();
			xhr.timeout = 6666;
			xhr.addEventListener('readystatechange', function(e){
				console.log(String(new Date()), 'finished', this.readyState);
			});
			xhr.addEventListener('timeout', function(e){
				console.log(String(new Date()), 'timeout', e);
			});
			xhr.open('GET', url);
			xhr.send();
		},
	},
}
</script>
