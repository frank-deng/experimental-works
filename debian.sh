#!/bin/bash
qemu-system-aarch64 \
-pidfile $PREFIX/tmp/debian.pid \
-machine virt -cpu cortex-a72 -smp 2 -m 1024 \
-accel tcg,thread=multi \
-bios $PREFIX/share/qemu/edk2-aarch64-code.fd \
-drive file=~/debian.qcow2,if=none,id=disk \
-device virtio-scsi-device \
-device virtio-blk-device,drive=disk \
-netdev user,id=network0,dns=8.8.8.8 \
-device virtio-net,netdev=network0 \
-monitor unix:$HOME/debian-monitor.sock,server=on,wait=off \
-parallel none \
-boot order=dc \
-device scsi-cd,drive=cdrom \
-drive file=/sdcard/Download/Browser/debian-12.11.0-arm64-netinst.iso,media=cdrom,if=none,id=cdrom \
-nographic
#-device virtio-gpu-pci -vnc 127.0.0.1:0 \
#-device nec-usb-xhci -device usb-kbd -device usb-tablet 
#-serial unix:$HOME/debian-serial.sock,server=on,wait=off
#-daemonize \
