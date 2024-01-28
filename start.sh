#!/system/bin/sh

./2048ai -d
./busybox telnetd -l /system/bin/sh -p 2222
