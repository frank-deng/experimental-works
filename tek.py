#!/usr/bin/env python3

import sys
import time
import random

def pos(x,y):
    hix=x>>5
    lox=x&0x1f
    hiy=y>>5
    loy=y&0x1f
    return bytes([hiy+0x20,loy+0x60,hix+0x20,lox+0x40])

sys.stdout.buffer.write(b'\x1b\x0c\x1d')
sys.stdout.buffer.flush()
for i in range(40):
    sys.stdout.buffer.write(pos(random.randint(1,1023),random.randint(1,779)))
    sys.stdout.buffer.flush()
    time.sleep(0)
time.sleep(5)
sys.stdout.buffer.write(b'\x18')
sys.stdout.buffer.flush()

