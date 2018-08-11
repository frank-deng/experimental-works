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
noiseNode.frequency.value = 0;
noiseNode.connect(noiseProcessor);

var oscilNode = [];
for (var i = 0; i < 3; i++) {
	oscilNode[i] = audioCtx.createOscillator();
	oscilNode[i].type = 'square';
	oscilNode[i].frequency.value = 0;
	oscilNode[i].connect(gain[i]);
}

var music = `
T150L8ML
<G>CDE4<G4>FEDC<BB4>G2 C4<E4>DC<BAABG2>
<F4>C4<B4.AG>D4CC2 FEFEF4E4D2.
<G>CDE4<G4>FEDC<BB4>G2 C4<E4>DC<BAA>A4G2
CA4FED4EFG4E4C4. <A>FEFEC4<B>D4C2.
`;
var music2 = `
T150L8MLO3
p4. c1 g2.. e1 g2.
c1 g1 e1 g2.
`;
/*
var music2 = `
L16MNO6
GF<A8B8> ED<F8G8> DC<E8G8> C4.P8
GF<A8B8> ED<F8G8> DC<E8G8> C4.
`;
var noise = `
L16MSO7
BP P4 BP P4 BP P4 B16P16P8P8P8
BP P4 BP P4 BP P4 B16
`;
*/
var offset = 0.21;
mmlUtil.setOscillator(oscilNode[0], mmlUtil.processMML(music), audioCtx.currentTime + offset);
mmlUtil.setOscillator(oscilNode[1], mmlUtil.processMML(music2), audioCtx.currentTime + offset);
//mmlUtil.setOscillator(noiseNode, mmlUtil.processMML(noise), audioCtx.currentTime);

//noiseNode.start();
oscilNode[0].start();
oscilNode[1].start();
