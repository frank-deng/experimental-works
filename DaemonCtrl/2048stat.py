#!/usr/bin/env python3

def convboard(board):
    result = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    for y in range(4):
        for x in range(4):
            powerVal = board & 0xf;
            if (powerVal):
                result[y][x] = (1 << powerVal)
            board >>= 4;
    return result;

import sys, csv, json;

logfile = sys.argv[1];
statfile = sys.argv[2];

log = {};
with open(logfile, 'r') as f:
    lines = csv.reader(f);
    for line in lines:
        key = line[2];
        if not log.get(key):
            log[key] = 1;
        else:
            log[key] += 1;

jsonData = {
    'log': [],
    'stat': [],
}
for key in [str(n) for n in sorted([int(n) for n in log.keys()])]:
    jsonData['log'].append({'maxval':int(key), 'times':log[key]});

with open(statfile, 'r') as f:
    lines = csv.reader(f);
    for line in lines:
        jsonData['stat'].append({
            'moves':int(line[0]),
            'score':int(line[1]) - int(line[2]),
            'board':convboard(int(line[3], 16)),
        });

print(json.dumps(jsonData, sort_keys=True));

