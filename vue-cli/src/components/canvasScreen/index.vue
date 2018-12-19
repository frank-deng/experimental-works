<template>
	<div>
		<div class='bgmask'></div>
		<screen class='screen' ref='screen'></screen>
		<el-button class='toggleDebug' type='primary' size='large' icon='el-icon-info' @click='toggleDebug'></el-button>
        <el-input class='hiddenInput' v-model='text'></el-input>
	</div>
</template>
<style scoped>
.bgmask{
	background-color:#2c3e50;
	position:fixed;
	left:0;
	top:0;
	right:0;
	bottom:0;
	z-index:0;
}
.toggleDebug{
	position:fixed;
	opacity:0.4;
	right:0;
	bottom:0;
	z-index:20;
}
.screen{
	position:fixed;
	left:50%;
	top:5px;
	transform:translate(-50%,0);
	z-index:10;
}
.hiddenInput{
   position:fixed;
   bottom:0;left:0;right:50%;
  z-index:666;
  opacity:0;
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
          text:'',
		};
	},
    watch:{
      text(text){
        console.log(text);
      },
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
			let canvas = this.$refs.screen.$el;
			let {width, height} = fitRect(window.innerWidth-10, window.innerHeight-10, canvas.width, canvas.height);
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
		//document.getElementById('logger_element').style.display = 'none';
		
		//Test the screen
		let videoRAM = this.$refs.screen.videoRAM;
		
		let charMap = [0x0480,0x0ea0,0x7890,0x0890,0x0884,0xfffe,0x0880,0x0890,0x0a90,0x0c60,0x1840,0x68a0,0x0920,0x0a14,0x2814,0x100c];
		let charLeft=[], charRight=[];
		charMap.map((data,i)=>{
			charLeft.push(data>>8);
			charRight.push(data&0xff);
		});
		videoRAM[1] = 0xaaaa;
		videoRAM[20*60+1] = 0xffff;
		
		let scr=this.$refs.screen;
		scr.pat8x16(charLeft,48+7,64,0);
		scr.pat8x16(charRight,48+7+8,64,0);
		scr.pat16x16(charMap,32,64,0);
		scr.pat16x8(charMap,33,64,1);
		scr.pat16x16(charMap,35,80,0);
		scr.pat16x16(charMap,35+16,80,0);
		
		scr.hline(1,14,10,1);
		scr.hline(16,155,11,1);
		scr.vline(0,1,198,1);
		scr.vline(1,1,198,1);
	},
}
</script>
