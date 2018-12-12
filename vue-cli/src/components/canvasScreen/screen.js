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
		dot(x,y,color){
			if(color){
				this.videoRAM[20*y+(x>>4)] |= (0x8000>>(x&0xf));
			}else{
				this.videoRAM[20*y+(x>>4)] &= ~(0x8000>>(x&0xf));
			}
		},
		hline(x0,x1,y,color){
			let seg0=(x0>>4), seg1=(x1>>4);
			let head = (0xffff>>(x0&0xf));
			let tail = (~((0x8000>>(x1&0xf))-1));
			if (seg0==seg1){
				if(color){
					this.videoRAM[20*y+seg0] |= (head&tail);
				}else{
					this.videoRAM[20*y+seg0] &= ~(head&tail);
				}
				return;
			}
			if(color){
				this.videoRAM[20*y+seg0] |= head;
				this.videoRAM[20*y+seg1] |= tail;
				for(let i=seg0+1;i<=seg1-1;i++){
					this.videoRAM[20*y+i] = 0xffff;
				}
			}else{
				this.videoRAM[20*y+seg0] &= ~head;
				this.videoRAM[20*y+seg1] &= ~tail;
				for(let i=seg0+1;i<=seg1-1;i++){
					this.videoRAM[20*y+i] = 0x0000;
				}
			}
		},
		vline(x,y0,y1,col){
			let seg=(x>>4);
			if(color){
				let val=(0x8000>>(x&0xf));
				for(let y=y0;y<=y1;y++){
					this.videoRAM[20*y+seg] |= val;
				}
			}else{
				let val=~(0x8000>>(x&0xf));
				for(let y=y0;y<=y1;y++){
					this.videoRAM[20*y+seg] &= val;
				}
			}
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
