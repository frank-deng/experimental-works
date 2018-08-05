import {processMML} from '@/js/mmlUtil.js';
export default {
	data(){
		return {
			audioCtx: undefined,
			gainNode: undefined,
			oscillator: undefined,
			soundType: 'square',
			running: false,
			volume: 0.5,
			song: '',
		};
	},
	watch:{
		'volume'(vol){
			if (this.running) {
				this.gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
			}
		},
	},
	methods: {
		stopPlaying(){
			this.oscillator.stop();
			this.running = false;
		},
		togglePlay(){
			if (this.running){
				this.stopPlaying();
			} else {
				this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

				let oscillator = this.audioCtx.createOscillator();
				oscillator.type = this.soundType;

				let cmdAll = processMML(this.song);
				for (let cmd of cmdAll) {
					oscillator.frequency.setValueAtTime(cmd.freq, this.audioCtx.currentTime + cmd.time);
				}
				oscillator.connect(this.gainNode);
				oscillator.start();
				oscillator.stop(this.audioCtx.currentTime + cmdAll[cmdAll.length-1].time + 0.1);
				oscillator.addEventListener('ended', ()=>{
					this.stopPlaying();
				});

				this.oscillator = oscillator;
				this.running = true;
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

