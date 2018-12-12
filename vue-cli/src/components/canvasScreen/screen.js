var createImageTemplate=function(ctx, data, fg){
	let result = ctx.createImageData(32, 2);
	let r=(fg>>24)&0xff, g=(fg>>16)&0xff, b=(fg>>8)&0xff, a=fg&0xff;
	for(let i=0; i<16; i++){
		if (data & (1<<(15-i))){
			result.data[i*8] = r;
			result.data[i*8+1] = g;
			result.data[i*8+2] = b;
			result.data[i*8+3] = a;
			result.data[i*8+4] = r;
			result.data[i*8+5] = g;
			result.data[i*8+6] = b;
			result.data[i*8+7] = a;
			result.data[128+i*8] = r;
			result.data[128+i*8+1] = g;
			result.data[128+i*8+2] = b;
			result.data[128+i*8+3] = a;
			result.data[128+i*8+4] = r;
			result.data[128+i*8+5] = g;
			result.data[128+i*8+6] = b;
			result.data[128+i*8+7] = a;
		}
	}
	return result;
}
var fgcol = 0xffff00ff, width = 320, height = 200, rowCnt = width/16;
var tick = 0, imageTemplate = [];
export default{
	data(){
		return {
			videoRAM:new Uint16Array(width*height/16),
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
		for(let i=0;i<=0xFFFF;i++){
			imageTemplate[i] = createImageTemplate(canvas, i, fgcol);
		}
		let doFrameUpdate=()=>{
			requestAnimationFrame(doFrameUpdate);
			tick++;
			if (tick<5){
				return;
			}
			tick=0;
			for(let y=0;y<height;y++){
				for(let x=0;x<rowCnt;x++){
					let idx = this.videoRAM[y*rowCnt+x];
					canvas.putImageData(imageTemplate[idx], x<<5, y<<1);
				}
			}
		}
		doFrameUpdate();
	},
}
