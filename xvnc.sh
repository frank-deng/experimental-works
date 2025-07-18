#!/bin/bash

pkill -9 pulseaudio;
LD_PRELOAD='/system/lib64/vendor.huawei.hardware.iawareperf@1.0.so:/system/lib64/liblzma.so' pulseaudio --start; 

if [[ $1 == '--start-xvnc' ]]; then
	export DISPLAY=:10
	Xvnc --SecurityTypes=None -a 1 -geometry 1024x768 -depth 32 -localhost $DISPLAY & PID_XVNC=$!
	fvwm
	kill -2 $PID_XVNC
else
	nohup xvnc.sh --start-xvnc &>/dev/null &
fi


