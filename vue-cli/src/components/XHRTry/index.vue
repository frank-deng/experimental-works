<template>
	<div>
		<el-button type='primary' @click='updateTime'>更新时间</el-button>
		<el-button type='primary' @click='doTimeout'>超时请求</el-button>
		<el-button type='primary' @click='frequentRequest'>{{timerReq ? '停止请求' : '大量请求'}}</el-button>
		<p>{{message}}</p>
	</div>
</template>
<script>
var brake = 0;
setInterval(()=>{
	brake = 0;
}, 200);

var _slice = Array.prototype.slice;
var xhrproto = XMLHttpRequest.prototype
xhrproto._send = xhrproto.send;
xhrproto._open = xhrproto.open;
xhrproto.send = function(content){
	if (brake){
		return false;
	}
	this._send(content);
	brake = 1;
	return true;
}
xhrproto.open = function(){
	this.method = arguments[0];
	return this._open.apply(this, _slice.call(arguments));
}
var _XMLHttpRequest = XMLHttpRequest;
XMLHttpRequest = function(){
	var xhr = new _XMLHttpRequest();
	xhr.addEventListener('load', function(e){
		console.log('[XHR] '+this.method+' '+this.responseURL+' '+this.status+' '+this.statusText);
	});
	xhr.addEventListener('timeout', function(e){
		console.log('timeout', this);
	});
	xhr.addEventListener('error', function(e){
		console.log('error', this);
	});
	xhr.addEventListener('abort', function(e){
		console.log('aborted', this);
	});
	return xhr;
}

export default{
	data(){
		return {
			time: '',
			timerReq: undefined,
			message: '',
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
				this.message = '';
				//this.$beep(false);
			} else {
				this.timerReq = setInterval(()=>{
					this.request('http://localhost:8081/time.do');
				}, 1);
			}
		},
		request(url){
			var vm = this;
			var xhr = new XMLHttpRequest();
			xhr.timeout = 2333;
			xhr.onload = function(){
				console.log('onload');
			}
			xhr.open('GET', url);
			if (!xhr.send()){
				this.message = 'Too many requests';
				//this.$beep(true);
			}
		},
	},
	mounted(){
		var a = function(){}
		a.prototype.show = function(){
			return 'hahaha';
		}
		var b = function(){
			var aa = new a();
			aa.hahaha = '2333';
			return aa;
		}
		var k = new b();
		console.log(k.hahaha, k.show());
	},
}
</script>
