#!/usr/bin/env python3

import gi, re;
gi.require_version('Wnck', '3.0');
from gi.repository import Wnck, Gdk, GdkX11;

def get_window_by_title(regexp):
    result = [];
    screen = Wnck.Screen.get_default();
    screen.force_update();
    for win in screen.get_windows():
        if re.match(regexp, win.get_name()):
            result.append(win);
    return result;

np_running = get_window_by_title(r'Neko Project');
if (len(np_running) == 0):
    print('Error: No instances of Neko Project II is running.');
    exit(1);
elif (len(np_running) > 1):
    print('Error: More than 1 instances of Neko Project II is running.');
    exit(1);

screen = GdkX11.X11Display.get_default();
win = GdkX11.X11Window.foreign_new_for_display(screen, np_running[0].get_xid());
(x, y, w, h) = win.get_geometry();
pixbuf = Gdk.pixbuf_get_from_window(win, x, y, w, h);
#pixbuf.savev('output.png', "png", "", "");
#print(dir(pixbuf));
#print(pixbuf.get_n_channels());

with open('output.ppm', 'wb') as f:
    f.write(b'P6\n');
    f.write(b'%d %d\n'%(pixbuf.get_width(), pixbuf.get_height()));
    f.write(b'%d\n'%((1 << pixbuf.get_bits_per_sample()) - 1));
    f.write(pixbuf.get_pixels());

