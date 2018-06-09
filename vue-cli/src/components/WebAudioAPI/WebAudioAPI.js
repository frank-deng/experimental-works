export default {
	data(){
		return {
			audioCtx: undefined,
			oscillator: undefined,
		};
	},
	methods: {
		toggleBeep(){
			if (this.oscillator){
				this.oscillator.stop();
				this.oscillator = undefined;
			} else {
				let oscillator = this.audioCtx.createOscillator();
				oscillator.type = 'sine';
				oscillator.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
				oscillator.connect(this.audioCtx.destination);
				oscillator.start();
				this.oscillator = oscillator;
			}
		},
	},
	mounted(){
		this.audioCtx = new AudioContext();
	},
}

