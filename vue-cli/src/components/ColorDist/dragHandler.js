export function DragHandler(handler, handlerEnd){
	this.handler = handler;
	this.handlerEnd = handlerEnd;
	this.x0 = undefined;
	this.y0 = undefined;
	window.addEventListener('mousedown', (e)=>{
		e.preventDefault();
		if (undefined !== this.x0) {
			return;
		}
		this.x0 = e.screenX;
		this.y0 = e.screenY;
	});
	window.addEventListener('touchstart', (e)=>{
		if (undefined !== this.x0 || e.touches.length > 1) {
			return;
		}
		this.x0 = e.touches[0].screenX;
		this.y0 = e.touches[0].screenY;
	});
	window.addEventListener('mouseup', (e)=>{
		if (this.handlerEnd) {
			this.handlerEnd(e, this.x0, this.y0, e.screenX, e.screenY);
		}
		this.x0 = this.y0 = undefined;
	});
	window.addEventListener('touchend', (e)=>{
		if (this.handlerEnd) {
			this.handlerEnd(e, this.x0, this.y0, e.screenX, e.screenY);
		}
		this.x0 = this.y0 = undefined;
	});
	window.addEventListener('mousemove', (e)=>{
		if (undefined !== this.x0) {
			this.handler(e, this.x0, this.y0, e.screenX, e.screenY);
		}
	});
	window.addEventListener('touchmove', (e)=>{
		if (undefined !== this.x0) {
			this.handler(e, this.x0, this.y0, e.touches[0].screenX, e.touches[0].screenY);
		}
	});
}
