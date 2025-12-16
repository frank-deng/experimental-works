#!/bin/bash
qemu-system-x86_64 \
-pidfile $PREFIX/tmp/alpine-x86_64.pid \
-machine q35 -cpu qemu64 -smp 1 -m 512 \
-accel tcg,thread=multi \
-drive file=/sdcard/devel/alpine-x86_64.qcow2,index=0 \
-netdev user,id=network0,hostfwd=tcp:127.0.0.1:2333-:23,dns=8.8.8.8 \
-device virtio-net,netdev=network0 \
-monitor unix:$HOME/alpine-monitor.sock,server=on,wait=off \
-serial unix:$HOME/alpine-serial.sock,server=on,wait=off \
-parallel none -no-reboot -boot d \
-display none -daemonize \
#-device virtio-gpu-pci -vnc 127.0.0.1:0 \
#-device nec-usb-xhci -device usb-kbd -device usb-tablet
#-drive file=/sdcard/devel/alpine-standard-3.22.1-x86_64.iso,media=cdrom,index=1  \
