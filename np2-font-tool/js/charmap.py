#!/usr/bin/env python3

import struct, json, os;

halfwidth_chars = '';
for idx in range(0x00, 256):
    if (idx >= 0x20):
        char = struct.pack('B', idx).decode('shift-jis', errors='ignore');
        if (idx == 0x7f):
            halfwidth_chars += ' ';
        elif (char):
            halfwidth_chars += char;
        else:
            halfwidth_chars += ' ';

fullwidth_chars = [];
for row in range(0xa1, 0xfe):
    crow = '';
    for col in range(0xa1, 0xfe):
        char = struct.pack('BB', row, col).decode('euc-jp', errors='ignore');
        if (char):
            crow += char;
        else:
            crow += ' ';
    if (len(crow.strip()) > 0):
        fullwidth_chars.append(crow);
    else:
        fullwidth_chars.append('');

with open('charmap.js', 'w') as f:
    f.write('CHARMAP='+json.dumps({
        'a':halfwidth_chars,
        'j':fullwidth_chars,
    }, ensure_ascii=False, separators=(',', ':')));
