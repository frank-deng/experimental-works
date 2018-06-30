var dtmfTable = {
	'*': [941, 1209],
	'0': [941, 1336],
	'#': [941, 1477],
	'1': [697, 1209],
	'2': [697, 1336],
	'3': [697, 1477],
	'4': [770, 1209],
	'5': [770, 1336],
	'6': [770, 1477],
	'7': [852, 1209],
	'8': [852, 1336],
	'9': [852, 1477],
};
export default{
	data(){
		return {
			dialNum: undefined,
			volume: undefined,
			audioCtx: undefined,
			freq0: undefined,
			freq1: undefined,
			gain0: undefined,
			gain1: undefined,
		};
	},
	watch: {
		'dialNum'(dialNum){
			if (!dialNum) {
				this.freq0.stop();
				this.freq1.stop();
				return;
			}
			this.freq0 = this.audioCtx.createOscillator();
			this.freq0.type = 'sine';
			this.freq0.connect(this.gain0);
			this.freq1 = this.audioCtx.createOscillator();
			this.freq1.type = 'sine';
			this.freq1.connect(this.gain1);

			let freq = dtmfTable[dialNum];
			this.freq0.frequency.setValueAtTime(freq[0], this.audioCtx.currentTime);
			this.freq1.frequency.setValueAtTime(freq[1], this.audioCtx.currentTime);
			this.freq0.start();
			this.freq1.start();
		},
		'volume'(volume){
			this.gain0.gain.setValueAtTime(volume * 0.5, this.audioCtx.currentTime);
			this.gain1.gain.setValueAtTime(volume * 0.5, this.audioCtx.currentTime);
		}
	},
	methods: {
		changeVolume(vol){
			if (this.running) {
			}
		},
		dial(number){
			this.dialNum = number;
		},
	},
	mounted(){
		this.audioCtx = new AudioContext();

		//Freq 0
		this.gain0 = this.audioCtx.createGain();
		this.gain0.connect(this.audioCtx.destination);

		//Freq 1
		this.gain1 = this.audioCtx.createGain();
		this.gain1.connect(this.audioCtx.destination);

		this.volume = 0.5;
	},
}
