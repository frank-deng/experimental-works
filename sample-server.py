#!/usr/bin/env python3

import sys, argparse, json, bottle, os, datetime, time;

# Prepare parameters from cmdline
parser = argparse.ArgumentParser();
parser.add_argument('-H', '--host', metavar='Host', type=str, default=[''], nargs=1, help='Binding Host');
parser.add_argument('-P', '--port', metavar='Port', type=int, default=[8081], nargs=1, help='Server Port');
args = parser.parse_args();

# Prepare HTTP server and related request handlers

@bottle.route('/time.do')
def showTime():
    bottle.response.set_header('Access-Control-Allow-Origin', '*');
    return json.dumps({
        'time': '{0:%Y-%m-%dT%H:%M:%S}'.format(datetime.datetime.now()),
    });

@bottle.route('/timeout.do')
def doTimeout():
    bottle.response.set_header('Access-Control-Allow-Origin', '*');
    time.sleep(10);
    return json.dumps({
        'time': '{0:%Y-%m-%dT%H:%M:%S}'.format(datetime.datetime.now()),
    });

try:
    bottle.run(server='eventlet', host=args.host[0], port=args.port[0]);
except KeyboardInterrupt:
    pass;

