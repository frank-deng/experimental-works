#!/bin/bash
qemu-system-aarch64 \
-pidfile $PREFIX/tmp/alpine.pid \
-machine virt -cpu cortex-a72 -smp 1 -m 128 \
-accel tcg,thread=multi \
-kernel ~/openeuler/vmlinuz \
-initrd ~/openeuler/Image \
-drive file=~/alpine.qcow2,if=none,id=disk \
-device virtio-scsi-device \
-device virtio-blk-device,drive=disk \
-netdev user,id=network0,dns=8.8.8.8 \
-device virtio-net,netdev=network0 \
-serial unix:$HOME/openeuler-serial.sock,server=on,wait=off \
-monitor unix:$HOME/openeuler-monitor.sock,server=on,wait=off \
-parallel none \
-device virtio-gpu-pci -vnc 127.0.0.1:0 \
-device nec-usb-xhci -device usb-kbd -device usb-tablet \
-serial unix:$HOME/openeuler-serial.sock,server,nowait

#-daemonize \
