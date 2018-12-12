var createImageTemplate=function(ctx, data, fg){
	let result = ctx.createImageData(16, 1);
	for(let i=0; i<16; i++){
		if (data & (1<<(15-i))){
			result.data[i*4] = (fg>>24)&0xff;
			result.data[i*4+1] = (fg>>16)&0xff;
			result.data[i*4+2] = (fg>>8)&0xff;
			result.data[i*4+3] = fg&0xff;
		}
	}
	return result;
}
var fgcol = 0xffff00ff;
export default{
	data(){
		return {
			videoRAM:undefined,
			imageTemplate:[],
			tick:0,
		};
	},
	methods:{
		drawPattern(x,y,w,data,mode=0){
			let h=Math.floor(data.length/w);
			let buffer = new Uint16Array(x&0xf ? w+1 : w);
		},
	},
	mounted(){
		let canvas = this.$refs.canvas.getContext("2d");
		let width = Number(this.$refs.canvas.width);
		let height = Number(this.$refs.canvas.height);
		this.videoRAM = new Uint16Array(width*height/16);

		for(let i=0;i<=0xFFFF;i++){
			this.imageTemplate[i] = createImageTemplate(canvas, i, fgcol);
		}
		
		let rowCnt = width/16;
		let doFrameUpdate=()=>{
			requestAnimationFrame(doFrameUpdate);
			this.tick++;
			if (this.tick<5){
				return;
			}
			this.tick=0;
			for(let y=0;y<height;y++){
				for(let x=0;x<rowCnt;x++){
					let idx = this.videoRAM[y*rowCnt+x];
					canvas.putImageData(this.imageTemplate[idx], x<<4, y);
				}
			}
		}
		doFrameUpdate();
	},
}
