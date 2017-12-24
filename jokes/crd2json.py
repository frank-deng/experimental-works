#!/usr/bin/env python3
# -*- coding: utf-8 -*-

ENCODING='GBK';

import argparse, struct, sys;

def crdDump(f):
    result = [];
    f.seek(3);
    count = struct.unpack('<H', f.read(2))[0];
    for idx in range(count):
        f.seek(5+52*idx);
        recHeader = struct.unpack('<6xIx40sx', f.read(52));
        offset = recHeader[0];
        title = recHeader[1];
        title = title[:title.find(b'\0')].decode(ENCODING);
        f.seek(offset);
        text = None;
        if (0 != struct.unpack('<I', f.read(4))):
            f.seek(offset+2);
            strLen = struct.unpack('<H', f.read(2))[0];
            f.seek(offset+4);
            text = f.read(strLen).decode(ENCODING).strip();
            result.append((title, text));

    return result;

if __name__ == '__main__':
    import json;
    if len(sys.argv) < 2:
        sys.stderr.write('Usage: %s cardfile.crd\n\n'%sys.argv[0]);
        exit(1);

    jsonData = [];
    with open(sys.argv[1], 'rb') as f:
        crd = crdDump(f);
        for title, text in crd:
            jsonData.append({'accept':1, 'text':text});

    sys.stdout.write(json.dumps(jsonData, ensure_ascii=False, sort_keys=True, indent=4, separators=(',', ': ')));
    exit(0);

