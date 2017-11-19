from datetime import datetime;
LOG_FILE='/sdcard/%s.txt'%(datetime.now().strftime('%y%m%d-%H%M'));

import android, time;
droid = android.Android();
droid.wakeLockAcquireDim();
droid.startLocating();
try:
    while True:
        loc = droid.readLocation().result;
        if 'gps' in loc:
            n = loc['gps'];
            la = n['latitude'];
            lo = n['longitude'];
            print('%.12f %.12f'%(la,lo));
            with open(LOG_FILE, 'a') as fp:
                fp.write('%.12f\t%.12f\n'%(la,lo));
        else:
            with open(LOG_FILE, 'a') as fp:
                fp.write('N/A\n');
        time.sleep(5);
except KeyboardInterrupt:
    pass;
finally:
    droid.stopLocating();
    droid.wakeLockRelease();

