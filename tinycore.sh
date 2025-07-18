#!/bin/bash
qemu-system-i386 \
-pidfile $PREFIX/tmp/tinycore.pid \
-machine type=q35,hpet=off -cpu max,vendor=GenuineIntel -smp 1 -m 128 \
-accel tcg,thread=multi \
-netdev user,id=network0,hostfwd=tcp:127.0.0.1:2345-:2345,dns=8.8.8.8 \
-device virtio-net,netdev=network0 \
-drive file=/sdcard/devel/tinycore.qcow2,format=qcow2 \
-display none -no-reboot -daemonize -boot d \
-serial unix:$HOME/tinycore-serial.sock,server,nowait
