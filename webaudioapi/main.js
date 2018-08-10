var volume = /\bvol=(\d+)/.exec(location.search);
if (volume && !isNaN(volume[1])) {
	volume = Number(volume[1]) / 100;
	if (volume > 1) {
		volume = 1;
	}
} else {
	volume = 0.1;
}

var channelCount = 4;
var audioCtx = new AudioContext();
var gainMaster = audioCtx.createGain();
gainMaster.connect(this.audioCtx.destination);
gainMaster.gain.setValueAtTime(volume / channelCount, this.audioCtx.currentTime);
var mute = ()=>{
	gainMaster.disconnect();
}
document.body.addEventListener('click', mute);
window.addEventListener('keydown', mute);

var mixer = this.audioCtx.createChannelMerger(1);
mixer.connect(gainMaster);

var gain = [];
for (var i = 0; i < channelCount; i++) {
	gain[i] = audioCtx.createGain(),
	gain[i].gain.setValueAtTime(1.0, this.audioCtx.currentTime);
	gain[i].connect(mixer);
}

var noiseProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
var value = Math.random()*2-1;
noiseProcessor.addEventListener('audioprocess', (e)=>{
	var len = e.outputBuffer.length;
	var input = e.inputBuffer.getChannelData(0);
	var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < len; i++) {
    	if (i > 0 && (input[i]>0) !== (input[i-1]>0)){
    		value = Math.random()*2-1;
		}
		output[i] = value;
    }
});
noiseProcessor.connect(gain[3]);

var noiseNode = audioCtx.createOscillator();
noiseNode.type = 'square';
noiseNode.connect(noiseProcessor);

var oscilNode = [];
for (var i = 0; i < 3; i++) {
	oscilNode[i] = audioCtx.createOscillator();
	oscilNode[i].type = 'square';
	oscilNode[i].connect(gain[i]);
}

var music = `
L16MLO5
GF<A8B8> ED<F8G8> DC<E8G8> C4.P8
GF<A8B8> ED<F8G8> DC<E8G8> C4.
`;
var music2 = `
L16MLO3
GF<A8B8> ED<F8G8> DC<E8G8> C4.P8
GF<A8B8> ED<F8G8> DC<E8G8> C4.
`;
var noise = `
L16MLO7
CP P4 CP P4 CP P4 C4.P8
CP P4 CP P4 CP P4 C4.
`;
var offset = 0.21;
mmlUtil.setOscillator(oscilNode[0], mmlUtil.processMML(music), audioCtx.currentTime + offset);
mmlUtil.setOscillator(oscilNode[1], mmlUtil.processMML(music2), audioCtx.currentTime + offset);
mmlUtil.setOscillator(noiseNode, mmlUtil.processMML(noise), audioCtx.currentTime);

gain[1].gain.value = 0.5;
gain[3].gain.value = 0.5;

noiseNode.start();
oscilNode[0].start(audioCtx.currentTime + offset);
oscilNode[1].start(audioCtx.currentTime + offset);
