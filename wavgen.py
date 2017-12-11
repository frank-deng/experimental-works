#!/usr/bin/env python3

import wave, random, math, struct
with wave.open('1.wav', 'wb') as f:
    f.setnchannels(1);
    f.setframerate(44100);
    f.setsampwidth(2);
    wavdata = [0.5*math.sin(n/20*2*math.pi+0.6*math.pi)+0.5* math.sin(n/44.1*2*math.pi) for n in range(200000)];
    wavdata = b''.join([struct.pack('h', int(sample*32000)) for sample in wavdata]);
    f.writeframes(wavdata);
