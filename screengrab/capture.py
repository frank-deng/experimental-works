#!/usr/bin/env python3

from WindowGrabber import WindowGrabber;
import numpy as np;
import cv2;

def writePpm(fname, pixbuf):
    with open(fname, 'wb') as f:
        f.write(b'P6\n');
        f.write(b'%d %d\n'%(pixbuf.get_width(), pixbuf.get_height()));
        f.write(b'%d\n'%((1 << pixbuf.get_bits_per_sample()) - 1));
        f.write(pixbuf.get_pixels());

def showImage(img, matchedPos = None, tempImg = None):
    WINDOW_TITLE = 'Broadway Legend Ellena';
    if (matchedPos != None and tempImg != None):
        markImg = img.copy();
        for i, pos in enumerate(matchedPos):
            top_left = pos;
            w, h = tempImg[i].shape[:2];
            bottom_right = (top_left[0] + h, top_left[1] + w);
            cv2.rectangle(markImg, top_left, bottom_right, (0, 0, 255), 2);
        cv2.imshow(WINDOW_TITLE, markImg);
    else:
        cv2.imshow(WINDOW_TITLE, img);
    while True:
        k = cv2.waitKey(100);
        if (cv2.getWindowProperty(WINDOW_TITLE, cv2.WND_PROP_VISIBLE) < 1 or k >= 0):
            break;
    cv2.destroyAllWindows();

npRunning = WindowGrabber.getWindowByTitle(r'Neko Project');
if (len(npRunning) == 0):
    print('Error: No instances of Neko Project II is running.');
    exit(1);
elif (len(npRunning) > 1):
    print('Error: More than 1 instances of Neko Project II is running.');
    exit(1);
windowGrabber = WindowGrabber(npRunning[0]);

#Capture image from Neko Project II
pixbuf = windowGrabber.capture();
cvimg = cv2.cvtColor(
    np.fromstring(pixbuf.get_pixels(), np.uint8).reshape(
        pixbuf.get_height(),
        pixbuf.get_width(),
        pixbuf.get_n_channels()
    ),
    cv2.COLOR_BGR2RGB
);

#Load sample image
imgTitle = cv2.imread('images/title.png');
imgDialogMode = cv2.imread('images/dialog_mode.png');

#Draw boxes for marking
tempImg = imgTitle;
res = cv2.matchTemplate(cvimg, tempImg, cv2.TM_CCOEFF_NORMED);
loc = list(zip(*np.where(res >= 0.9)[::-1]));
showImage(cvimg, loc, [tempImg] * len(loc));

