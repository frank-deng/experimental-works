#!/usr/bin/env python3
#-*-coding:utf8;-*-
#qpy:3
#qpy:console

import os,sys,re,bottle,config;

try:
    DEBUG_MODE = config.DEBUG;
except AttributeError:
    DEBUG_MODE = False;

try:
    USE_WAKELOCK_DIM = config.WAKELOCK_DIM;
except AttributeError:
    USE_WAKELOCK_DIM = False;

try:
    ROOT_DIR=config.ROOT_DIR;
except AttributeError:
    sys.stderr.write('ROOT_DIR not specified.');
    exit(1);

try:
    HOST = config.HOST;
except AttributeError:
    HOST = '0.0.0.0';

try:
    PORT = config.PORT;
except AttributeError:
    PORT = 8080;

try:
    ROOT_RES = config.ROOT_RES;
except AttributeError:
    ROOT_RES = os.path.dirname(os.path.abspath(__file__))+os.sep+'res'+os.sep;

try:
    bottle.TEMPLATE_PATH.append(config.TEMPLATE_PATH);
except AttributeError:
    bottle.TEMPLATE_PATH.append(os.path.dirname(os.path.abspath(__file__))+os.sep+'views'+os.sep);

@bottle.route('/__exit', method=['GET','HEAD'])
def __exit():
    raise KeyboardInterrupt;

@bottle.route('/__ping')
def __ping():
    return 'ok';

@bottle.route('/.res/<path:path>')
def handle_res(path):
    return bottle.static_file(path, root=ROOT_RES);

@bottle.route('/<path:path>')
def handle_file(path):
    result = bottle.static_file(path, root=ROOT_DIR);
    if (type(result) is bottle.HTTPError and result.status_code == 404):
        if (path[-1] != '/'):
            bottle.redirect('/'+path+'/');
        if bottle.request.query.t:
            template = bottle.request.query.t;
        else:
            template = 'default';
        return autoindex(path, template);
    else:
        return result;

@bottle.route('/')
def handle_index():
    if bottle.request.query.t:
        template = bottle.request.query.t;
    else:
        template = 'default';
    return autoindex('/', template);

#=====================
__re_path = re.compile(r'\/+');
__re_msie = re.compile(r'MSIE (6.0|7.0|8.0)');
__re_mobile = re.compile(r'(iPhone|Android.*Mobile)');
__re_pad = re.compile(r'(iPad|Android)');
def autoindex(path, template='default', root=ROOT_DIR):
    #Process Path
    realpath = os.path.realpath(ROOT_DIR+'/'+path);
    if (realpath.find(os.path.realpath(ROOT_DIR)) != 0):
        raise bottle.HTTPError(500, 'Invalid Directory');
    elif not os.path.isdir(realpath):
        raise bottle.HTTPError(404, 'Directory not exist.');
    path, n = __re_path.subn('/', '/'+path+'/');

    #Process User Agent
    user_agent = str(bottle.request.headers.get('User-Agent'));
    if len(__re_msie.findall(user_agent)) > 0:
        browser_type = 'oldie';
    elif len(__re_mobile.findall(user_agent)) > 0:
        browser_type = 'mobile';
    elif len(__re_pad.findall(user_agent)) > 0:
        browser_type = 'pad';
    else:
        browser_type = 'pc';

    #Process Files
    dirs, files = [], [];
    for item in os.listdir(realpath):
        if item[0] == '.':
            continue;
        elif os.path.isdir(realpath+os.sep+item):
            dirs.append(item);
        elif os.path.isfile(realpath+os.sep+item):
            files.append({'name':item,'size':os.path.getsize(realpath+os.sep+item)});
    dirs.sort();
    files.sort(key=lambda item:item['name']);
    
    for t in (template+'.'+browser_type, template, 'default.'+browser_type, 'default'):
        try:
            return bottle.template(t,
                path=path,
                dirs=dirs,
                files=files,
                user_agent=user_agent,
                browser_type=browser_type,
                file_open=bottle.request.query.f);
        except Exception as e:
            pass;
    raise bottle.HTTPError(500, 'Unable to render template.');

droid = None;
try:
    import android;
    droid = android.Android();
    if USE_WAKELOCK_DIM:
        droid.wakeLockAcquireDim();
    else:
        droid.wakeLockAcquirePartial();
    droid.wifiLockAcquireFull();
except ImportError:
    pass;
try:
    try:
        import cherrypy;
        bottle.run(server='cherrypy', host=HOST, port=PORT, debug=DEBUG_MODE);
    except ImportError:
        bottle.run(host=HOST, port=PORT, debug=DEBUG_MODE);
except KeyboardInterrupt:
    pass;
finally:
    if (None != droid):
        droid.wifiLockRelease();
        droid.wakeLockRelease();

