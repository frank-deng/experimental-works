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
			volume: 0.5,
			volumeKeyPress: 0.5,
			audioCtx: undefined,
			freq0: undefined,
			freq1: undefined,
			gainMaster: undefined,
			soundEffect: {
				keyPress: undefined,
				keyPressGain: undefined,
			},
		};
	},
	watch: {
		'dialNum'(dialNum){
			if (dialNum) {
				let freq = dtmfTable[dialNum];
				this.freq0.frequency.setValueAtTime(freq[0], this.audioCtx.currentTime);
				this.freq1.frequency.setValueAtTime(freq[1], this.audioCtx.currentTime);
				this.gainMaster.connect(this.audioCtx.destination);

				let source = this.audioCtx.createBufferSource();
				source.buffer = this.soundEffect.keyPress;
				source.connect(this.soundEffect.keyPressGain);
				source.start();
			} else {
				this.gainMaster.disconnect();
			}
		},
		'volume'(volume){
			this.gainMaster.gain.setValueAtTime(volume / 2, this.audioCtx.currentTime);
		},
		'volumeKeyPress'(volume){
			this.soundEffect.keyPressGain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
		},
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

		this.gainMaster = this.audioCtx.createGain();
		this.gainMaster.gain.setValueAtTime(this.volume / 2, this.audioCtx.currentTime);

		let mixer = this.audioCtx.createChannelMerger(2);
		mixer.connect(this.gainMaster);
		this.freq0 = this.audioCtx.createOscillator();
		this.freq0.type = 'sine';
		this.freq0.connect(mixer);
		this.freq0.start();
		this.freq1 = this.audioCtx.createOscillator();
		this.freq1.type = 'sine';
		this.freq1.connect(mixer);
		this.freq1.start();

		//Keypress effect
		this.soundEffect.keyPressGain = this.audioCtx.createGain();
		this.soundEffect.keyPressGain.connect(this.audioCtx.destination);
		this.soundEffect.keyPressGain.gain.setValueAtTime(this.volumeKeyPress, this.audioCtx.currentTime);

		//Load keyboard sound effect
		this.axios.get('static/keypress.ogg', {responseType: 'arraybuffer'}).then((resp)=>{
			return new Promise((resolve)=>{
				this.audioCtx.decodeAudioData(resp.data, (res)=>{
					resolve(res);
				});
			});
		}).then((audioData)=>{
			this.soundEffect.keyPress = audioData;
		});

		var vm = this;
		var keyAction = {
			'0'(){
				vm.dial("0");
			},
			'1'(){
				vm.dial("1");
			},
			'2'(){
				vm.dial("2");
			},
			'3'(){
				vm.dial("3");
			},
			'4'(){
				vm.dial("4");
			},
			'5'(){
				vm.dial("5");
			},
			'6'(){
				vm.dial("6");
			},
			'7'(){
				vm.dial("7");
			},
			'8'(){
				vm.dial("8");
			},
			'9'(){
				vm.dial("9");
			},
			'*'(){
				vm.dial("*");
			},
			'-'(){
				vm.dial("#");
			},
			'#'(){
				vm.dial("#");
			},
		};
		window.addEventListener('keydown', (e)=>{
			if (keyAction[e.key]) {
				keyAction[e.key]();
			}
		});
		window.addEventListener('keyup', (e)=>{
			this.dial();
		});
	},
}

