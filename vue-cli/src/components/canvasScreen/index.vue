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
	},
}
</script>
