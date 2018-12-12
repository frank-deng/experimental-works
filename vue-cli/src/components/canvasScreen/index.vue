<template>
	<div>
		<screen class='screen' :class='rotate ? "rotate" : ""' ref='screen'></screen>
		<el-button class='toggleDebug' type='primary' size='large' icon='el-icon-info' @click='toggleDebug'></el-button>
	</div>
</template>
<style scoped>
.toggleDebug{
	position:fixed;
	opacity:0.4;
	right:0;
	bottom:0;
}
.screen{
	position:fixed;
	left:50%;
	top:50%;
	transform:translate(-50%,-50%);
}
.screen.rotate{
	transform:translate(-50%,-50%) rotate(90deg);
}
</style>
<script>
import {fitRect} from '@/js/common.js';
import screen from './screen.vue';
export default{
	components:{
		screen,
	},
	data(){
		return {
			rotate:false,
		};
	},
	methods:{
		toggleDebug(){
			let elementDebug = document.getElementById('logger_element');
			if (!elementDebug){
				return;
			}
			let disp = elementDebug.style.display;
			elementDebug.style.display = ('none' == disp ? 'block' : 'none');
		},
		adjustScreen(){
			this.rotate = (window.innerWidth < window.innerHeight);
			let canvas = this.$refs.screen.$el;
			let {width, height} = this.rotate
				? fitRect(window.innerHeight-10, window.innerWidth-10, canvas.width, canvas.height)
				: fitRect(window.innerWidth-10, window.innerHeight-10, canvas.width, canvas.height);
			Object.assign(this.$refs.screen.$el.style, {
				width: `${width}px`,
				height: `${height}px`,
			});
		},
	},
	mounted(){
		this.adjustScreen();
		window.addEventListener('resize', ()=>{
			this.adjustScreen();
		});
		document.getElementById('logger_element').style.display = 'none';
		
		//Test the screen
		let videoRAM = this.$refs.screen.videoRAM;
		
		[0x0480,0x0ea0,0x7890,0x0890,0x0884,0xfffe,0x0880,0x0890,0x0a90,0x0c60,0x1840,0x68a0,0x0920,0x0a14,0x2814,0x100c].map((data,i)=>{
			videoRAM[20*(i+1)+3] = data;
		});
		videoRAM[1] = 0xaaaa;
		videoRAM[20*60+1] = 0xffff;
		
		this.$refs.screen.hline(1,14,10,1);
		this.$refs.screen.hline(16,310,11,1);
	},
}
</script>
