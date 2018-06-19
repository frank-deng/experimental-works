<template>
	<div>
		<el-button type='primary' @click='updateTime'>更新时间</el-button>
		<el-button type='primary' @click='doTimeout'>超时请求</el-button>
		<el-button type='primary' @click='frequentRequest'>{{timerReq ? '停止请求' : '大量请求'}}</el-button>
		<p>{{message}}</p>
	</div>
</template>
<script>
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
			xhr.timeout = 2000;
			xhr.onload = function(){
				console.log(this.responseText);
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
