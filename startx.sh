#!/bin/bash
function launch(){
	termux-x11 :0 -xstartup fvwm &>/dev/null &
}
cd; launch &>/dev/null &
