#!/usr/bin/env python3

def writePpm(fname, pixbuf):
    with open(fname, 'wb') as f:
        f.write(b'P6\n');
        f.write(b'%d %d\n'%(pixbuf.get_width(), pixbuf.get_height()));
        f.write(b'%d\n'%((1 << pixbuf.get_bits_per_sample()) - 1));
        f.write(pixbuf.get_pixels());

def showImage(img):
    WINDOW_TITLE = 'Broadway Legend Ellena';
    cv2.imshow(WINDOW_TITLE, cvimg);
    while True:
        k = cv2.waitKey(100);
        if (cv2.getWindowProperty(WINDOW_TITLE, cv2.WND_PROP_VISIBLE) < 1 or k >= 0):
            break;
    cv2.destroyAllWindows();

from WindowGrabber import WindowGrabber;

npRunning = WindowGrabber.getWindowByTitle(r'Neko Project');
if (len(npRunning) == 0):
    print('Error: No instances of Neko Project II is running.');
    exit(1);
elif (len(npRunning) > 1):
    print('Error: More than 1 instances of Neko Project II is running.');
    exit(1);
windowGrabber = WindowGrabber(npRunning[0]);

import numpy as np;
import cv2;

pixbuf = windowGrabber.capture();
cvimg = cv2.cvtColor(
    np.fromstring(pixbuf.get_pixels(), np.uint8).reshape(
        pixbuf.get_height(),
        pixbuf.get_width(),
        pixbuf.get_n_channels()
    ),
    cv2.COLOR_BGR2RGB
);
showImage(cvimg);


