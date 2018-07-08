export function beep98(volume = 0.5, extctx = undefined){
	var ctx = extctx || new AudioContext();

	var gain = ctx.createGain();
	gain.gain.setValueAtTime(volume, ctx.currentTime);
	gain.connect(ctx.destination);

	var beeper = ctx.createOscillator();
	beeper.type = 'square';
	beeper.frequency.setValueAtTime(2000, ctx.currentTime);
	beeper.frequency.setValueAtTime(1000, ctx.currentTime + 0.15);
	beeper.connect(gain);
	beeper.start();
	beeper.stop(ctx.currentTime + 0.3);
	setTimeout(()=>{
		gain.disconnect();
		beeper.disconnect();
		if (!extctx){
			ctx.close();
		}
	}, 400);
}

