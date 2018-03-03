#!/usr/bin/env python3

from BLEllena import BLEllena;
import time;

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


def printMoves(moves):
    labelMoves = ('Up', 'Left', 'Right', 'Down');
    textPrint = '';
    for m in moves:
        textPrint += labelMoves[m] + ' ';
    print(textPrint);

ellena = BLEllena();
try:
    lastMove = [];
    lastStatus = None;
    while True:
        status = ellena.getStatus();
        if (None != status and status != lastStatus):
            lastStatus = status;
            if BLEllena.ELLENA_WATCHING == status:
                print('Watching:');
            elif BLEllena.ELLENA_ACTIVE == status:
                print('Operating...');

        if (BLEllena.ELLENA_WATCHING == status):
            move = ellena.getMove();
            if (len(move) and (set(lastMove) != set(move))):
                printMoves(move);
                lastMove = move;
        else:
            lastMove = [];
        time.sleep(0.05);
except KeyboardInterrupt:
    pass;

