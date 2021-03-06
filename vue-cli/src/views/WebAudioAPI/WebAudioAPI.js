export default {
	data(){
		return {
			audioCtx: undefined,
			gainNode: undefined,
			oscillator: undefined,
			soundType: 'sine',
			running: false,
			frequency: 1000,
			volume: 0.5,
		};
	},
	watch:{
		'volume'(vol){
			if (this.running) {
				this.gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
			}
		},
		'frequency'(frequency){
			if (this.running) {
				this.oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
			}
		},
	},
	methods: {
		toggleBeep(){
			if (this.running){
				this.oscillator.stop();
				this.running = false;
			} else {
				let oscillator = this.audioCtx.createOscillator();
				oscillator.type = this.soundType;
				oscillator.frequency.setValueAtTime(this.frequency, this.audioCtx.currentTime);
				oscillator.connect(this.gainNode);
				oscillator.start();
				this.oscillator = oscillator;
				this.running = true;
				this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
			}
		},
	},
	mounted(){
		this.audioCtx = new AudioContext();
		let gainNode = this.audioCtx.createGain();
		gainNode.connect(this.audioCtx.destination);
		gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
		this.gainNode = gainNode;
	},
}

