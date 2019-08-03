var noteFreq = [
  16.352, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125, 24.500, 25.967, 27.500, 29.135, 30.868,
  32.703, 34.648, 36.709, 38.891, 41.203, 43.654, 46.249, 48.999, 51.913, 55.000, 58.270, 61.736,
  65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.83, 110.0,  116.54, 123.47,
  130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.0,  233.08, 246.94,
  261.63, 227.18, 293.66, 311.13, 326.63, 349.23, 369.99, 392.00, 415.30, 440.0,  466.16, 493.88,
  523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880.0,  932.33, 987.77,
  1046.5, 1108.7, 1174.7, 1244.5, 1318.5, 1396.9, 1480.0, 1568.0, 1661.2, 1760.0, 1864.7, 1975.53,
  2093.0, 2217.5, 2349.3, 2489.0, 2637.0, 2793.8, 2960.0, 3136.0, 3322.4, 3520.0, 3729.3, 3951.05,
  4186.0, 4439.9, 4498.6, 4978.0, 5474.0, 5587.7, 5919.9, 6271.9, 6644.9, 7040.0, 7458.6, 7902.1,
  8372.0, 8869.8, 9397.3, 9956.1, 10548, 11175, 11840, 12544, 13290, 14080, 14917, 15804
];
export function processMML(_mml){
  //Parse mml into notes
  var mml = _mml.slice(), match = undefined, pos = 0, commands = [];
  var note2num = {
    'P': 0,
    'C':1, 'C+':2, 'D':3, 'D+':4, 'E':5, 'F':6,
    'F+':7, 'G':8, 'G+':9, 'A':10, 'A+':11, 'B':12,
  };
  var noteConv = {
    'D-': 'C+',
    'E-': 'D+',
    'G-': 'F+',
    'A-': 'G+',
    'B-': 'A+',
  };
  while (mml.length) {
    if (match = /^\s+/.exec(mml)) {
      //Ignore white space chars
    } else if (match = /^(T|L|O)(\d+)/i.exec(mml)) {
      //Set tempo, note length, octave, pause
      commands.push([match[1].toUpperCase(), Number(match[2])]);
    } else if (match = /^(ML|MN|MS|\<|\>)/i.exec(mml)) {
      //Set music legato, normal, staccato, control octaves
      commands.push([match[0].toUpperCase()]);
    } else if (match = /^([CDEFGAB][#+-]?|P)(\d*)(\.*)/i.exec(mml)) {
      //Process note
      let note = match[1].toUpperCase().replace('#', '+');
      if (noteConv[note]) {
        note = noteConv[note];
      }
      if (undefined === note2num[note]) {
        throw SyntaxError('Invalid note ' + match[1] + ' at position ' + pos);
      }
      commands.push([note, Number(match[2]), match[3]]);
    } else {
      throw SyntaxError('Invalid MML character at position ' + pos);
    }
    mml = mml.slice(match[0].length);
    pos += match[0].length;
  }

  //Parse notes to instructions
  var octave = 5, baseDuration = 60 * 4 / 128, noteLenDef = 4, durationFrac=(7/8), time = 0;
  var result = [];
  var commandProcessor = {
    'ML':()=>{
      durationFrac = 1;
    },
    'MS':()=>{
      durationFrac = 3/4;
    },
    'MN':()=>{
      durationFrac = 7/8;
    },
    '<':()=>{
      if (octave > 0){
        octave--;
      }
    },
    '>':()=>{
      if (octave < 8){
        octave++;
      }
    },
    'T':(tempo)=>{
      baseDuration = 60 * 4 / tempo;
    },
    'L':(len)=>{
      noteLenDef = len;
    },
    'O':(_octave)=>{
      octave = _octave+2;
    },
  };
  for (let cmd of commands) {
    if (commandProcessor[cmd[0]]) {
      commandProcessor[cmd[0]](cmd[1]);
      continue;
    }
    let note = cmd[0];
    if (undefined === note2num[note]) {
      continue;
    }
    let duration = baseDuration / (cmd[1] || noteLenDef);
    switch (cmd[2]) {
      case '.':
        duration *= 1.5;
      break;
      case '..':
        duration *= 1.75;
      break;
    }

    let freq = note2num[note]? noteFreq[note2num[note]-1+octave * 12] : 0;

    if(1==durationFrac){
      result.push({
        freq: freq,
        time: time,
      });
    }else{
      let gap = duration * (1-durationFrac);
      result.push({
        freq: freq,
        time: time,
      });
      result.push({
        freq: 0,
        time: time+duration-gap,
      });
    }
    time += duration;
  }
  result.push({
    freq: 0,
    time: time,
  });
  return result;
}
export function setOscillator(oscillator, musicData, timeOffset){
  for (let item of musicData) {
    oscillator.frequency.setValueAtTime(item.freq, timeOffset + item.time);
  }
}

