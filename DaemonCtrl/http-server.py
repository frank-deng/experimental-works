#!/usr/bin/env python3

import sys, argparse, json, bottle, os, time, subprocess;
from DaemonCtrl import DaemonCtrl;

# Prepare parameters from cmdline
parser = argparse.ArgumentParser();
parser.add_argument('-H', '--host', metavar='Host', type=str, default=[''], nargs=1, help='Binding Host');
parser.add_argument('-P', '--port', metavar='Port', type=int, default=[8081], nargs=1, help='Server Port');
parser.add_argument('config', metavar='Config', type=str, nargs=1, help='Configuration file in JSON format');
args = parser.parse_args();

daemon = {};
try:
    config = None;
    with open(args.config[0]) as f:
        config = json.loads(f.read());
    for daemonName in config:
        daemon[daemonName] = {
            'instance': DaemonCtrl(config[daemonName]['cmd'], config[daemonName]['pid']),
            'stat': config[daemonName]['stat'],
        };
except Exception as e:
    sys.stderr.write('Initialization Failed: %s\n'%str(e));
    exit(1);

# Prepare HTTP server and related request handlers

@bottle.route('/daemonctrl/')
def listDaemons():
    result = {};
    for daemonName in daemon:
        instance = daemon[daemonName]['instance'];
        status = 'stopped';
        if (instance.getpid()):
            status = 'running';
        result[daemonName] = {'status': status};
    return json.dumps(result);

@bottle.route('/daemonctrl/<name:re:[A-Za-z0-9]+>/start')
def startDaemon(name):
    if (None == daemon.get(name)):
        bottle.HTTPError(404, 'Unable to find daemon: %s.'%name);
    if daemon[name]['instance'].start():
        return json.dumps({'status':'success'});
    else:
        return json.dumps({'status':'failed'});

@bottle.route('/daemonctrl/<name:re:[A-Za-z0-9]+>/stop')
def stopDaemon(name):
    if (None == daemon.get(name)):
        bottle.HTTPError(404, 'Unable to find daemon: %s.'%name);
    if daemon[name]['instance'].stop():
        return json.dumps({'status':'success'});
    else:
        return json.dumps({'status':'failed'});

@bottle.route('/daemonctrl/<name:re:[A-Za-z0-9]+>/stat')
def statDaemon(name):
    if (None == daemon.get(name)):
        bottle.HTTPError(404, 'Unable to find daemon: %s.'%name);
    _instance = daemon[name]['instance'];
    _statCmd = daemon[name]['stat'];
    pid = _instance.getpid();
    if (None != pid):
        os.kill(pid, 10);
        time.sleep(2);
    process = subprocess.Popen(_statCmd, stdout = subprocess.PIPE, stderr = subprocess.PIPE);
    stdout, stderr = process.communicate();
    bottle.response.set_header("Content-Type", "text/plain");
    return stdout;

@bottle.route('/<path:path>')
def staticFileHandler(path):
    if (not path):
        path = 'index.html';
    return bottle.static_file(path, root=os.path.dirname(os.path.abspath(__file__)) + os.sep + 'html');

@bottle.route('/')
def indexHandler():
    return staticFileHandler('index.html');

bottle.run(host=args.host[0], port=args.port[0]);
