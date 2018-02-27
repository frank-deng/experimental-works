#!/usr/bin/env python3

import gi, re;
gi.require_version('Wnck', '3.0');
from gi.repository import Gtk, Wnck;

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
print(np_running[0].get_name());

