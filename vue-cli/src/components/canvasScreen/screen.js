var setPixel=function(image,x,y,fg){
	let r=(fg>>24)&0xff, g=(fg>>16)&0xff, b=(fg>>8)&0xff, a=fg&0xff;
	let offset = (y*image.width+x)*4;
	image.data[offset] = r;
	image.data[offset+1] = g;
	image.data[offset+2] = b;
	image.data[offset+3] = a;
}
var drawPixel=function(image, x0, fg){
	for(let y=0;y<4;y++){
		for(let x=0;x<4;x++){
			setPixel(image,x+x0*5,y,fg);
		}
	}
}
var createImageTemplate=function(ctx, data, fg){
	let result = ctx.createImageData(16*5, 5);
	for(let i=0; i<16; i++){
		if (data & (1<<(15-i))){
			drawPixel(result,i,fg);
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
				this.videoRAM[rowCnt*y+(x>>4)] |= (0x8000>>(x&0xf));
			}else{
				this.videoRAM[rowCnt*y+(x>>4)] &= ~(0x8000>>(x&0xf));
			}
		},
		hline(x0,x1,y,color){
			let seg0=(x0>>4), seg1=(x1>>4);
			let head = (0xffff>>(x0&0xf));
			let tail = (~((0x8000>>(x1&0xf))-1));
			if (seg0==seg1){
				if(color){
					this.videoRAM[rowCnt*y+seg0] |= (head&tail);
				}else{
					this.videoRAM[rowCnt*y+seg0] &= ~(head&tail);
				}
				return;
			}
			if(color){
				this.videoRAM[rowCnt*y+seg0] |= head;
				this.videoRAM[rowCnt*y+seg1] |= tail;
				for(let i=seg0+1;i<=seg1-1;i++){
					this.videoRAM[rowCnt*y+i] = 0xffff;
				}
			}else{
				this.videoRAM[rowCnt*y+seg0] &= ~head;
				this.videoRAM[rowCnt*y+seg1] &= ~tail;
				for(let i=seg0+1;i<=seg1-1;i++){
					this.videoRAM[rowCnt*y+i] = 0x0000;
				}
			}
		},
		vline(x,y0,y1,col){
			let seg=(x>>4);
			if(color){
				let val=(0x8000>>(x&0xf));
				for(let y=y0;y<=y1;y++){
					this.videoRAM[rowCnt*y+seg] |= val;
				}
			}else{
				let val=~(0x8000>>(x&0xf));
				for(let y=y0;y<=y1;y++){
					this.videoRAM[rowCnt*y+seg] &= val;
				}
			}
		},
		pat8x8(data,x,y,transparent=0){
			if((x&0xf)<8){
				let offset=rowCnt*y+(x>>4);
				for(let i=0;i<4;i++){
					let value = this.videoRAM[offset];
					this.videoRAM[offset] = value;
					offset+=rowCnt;
				}
				return;
			}
		},
		pat16x16(data,x,y,op=0){
			let offset=rowCnt*y+(x>>4);
			if(!(x&0xf)){
				switch(op){
					case 0:
						for(let i=0;i<16;i++){
							this.videoRAM[offset]=data[i];
							offset+=rowCnt;
						}
					break;
					case 1:
						for(let i=0;i<16;i++){
							this.videoRAM[offset]|=data[i];
							offset+=rowCnt;
						}
					break;
				}
				return;
			}
			//Inter-segment operation
			let shift=x&0xf, mask=~(0xffff>>shift);
			switch(op){
				case 0:
					for(let i=0;i<16;i++){
						this.videoRAM[offset]&=mask;
						this.videoRAM[offset]|=data[i]>>shift;
						this.videoRAM[offset+1]&=(~mask);
						this.videoRAM[offset+1]|=(data[i]<<(16-shift))&0xffff;
						offset+=rowCnt;
					}
				break;
				case 1:
					for(let i=0;i<16;i++){
						this.videoRAM[offset]|=data[i]>>shift;
						this.videoRAM[offset+1]|=(data[i]<<(16-shift))&0xffff;
						offset+=rowCnt;
					}
				break;
			}
		}
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
					canvas.putImageData(imageTemplate[idx], x*80, y*5);
				}
			}
		}
		doFrameUpdate();
	},
}
