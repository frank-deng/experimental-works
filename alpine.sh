#!/bin/bash
qemu-system-aarch64 \
-pidfile $PREFIX/tmp/alpine.pid \
-machine virt -cpu cortex-a72 -smp 2 -m 512 \
-accel tcg,thread=multi \
-bios $PREFIX/share/qemu/edk2-aarch64-code.fd \
-drive file=/sdcard/devel/alpine.qcow2,if=none,id=disk \
-device virtio-scsi-device \
-device virtio-blk-device,drive=disk \
-netdev user,id=network0,hostfwd=tcp:127.0.0.1:8122-:22,hostfwd=tcp:127.0.0.1:2333-:2333,dns=8.8.8.8 \
-device virtio-net,netdev=network0 \
-monitor unix:$HOME/alpine-monitor.sock,server=on,wait=off \
-serial unix:$HOME/alpine-serial.sock,server=on,wait=off \
-parallel none -no-reboot -boot dc \
-display none -daemonize
#-device scsi-cd,drive=cdrom \
#-drive file=/sdcard/Download/Browser/alpine-standard-3.22.1-aarch64.iso,media=cdrom,if=none,id=cdrom \
#-device virtio-gpu-pci -vnc 127.0.0.1:0 \
#-device nec-usb-xhci -device usb-kbd -device usb-tablet \
