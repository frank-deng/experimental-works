#!/usr/bin/env python3

import wave, random, math, struct
with wave.open('1.wav', 'wb') as f:
    f.setnchannels(1);
    f.setframerate(44100);
    f.setsampwidth(2);
    wavdata = [math.sin(n/180*math.PI) for n in range(88888)];
    wavdata = b''.join([struct.pack('h', int(sample*32000)) for sample in wavdata]);
    f.writeframes(wavdata);
