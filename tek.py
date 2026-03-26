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
sys.stdout.buffer.write(pos(100,100))
sys.stdout.buffer.flush()
time.sleep(0)
sys.stdout.buffer.write(pos(1000,700))
sys.stdout.buffer.flush()
time.sleep(0)
sys.stdout.buffer.write(pos(1000,100))
sys.stdout.buffer.flush()
time.sleep(0)
#sys.stdout.buffer.write(b'\x20\x60\x20\x40')
#sys.stdout.buffer.write(b'\x27\x7f\x27\x5f')
#sys.stdout.buffer.write(b'\x1d')
#sys.stdout.buffer.write(b'\x20\x60\x27\x5f')
#sys.stdout.buffer.write(b'\x27\x7f\x20\x40')
time.sleep(3)
sys.stdout.buffer.write(b'\x18')
sys.stdout.buffer.flush()

