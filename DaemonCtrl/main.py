#!/usr/bin/env python3

import android, subprocess;
import os, sys;
from os.path import dirname, abspath;

droid = None;
try:
    import android;
    droid = android.Android();
    droid.wakeLockAcquireFull();
    droid.wifiLockAcquireFull();
except ImportError:
    pass;

try:
    proc = subprocess.Popen([
        sys.executable,
        dirname(abspath(__file__))+os.sep+'http-server.py',
        '-P', '8081',
        '/sdcard/daemoninfo.json',
    ]);
    proc.wait();
finally:
    if (None != droid):
        droid.wifiLockRelease();
        droid.wakeLockRelease();

