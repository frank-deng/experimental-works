#!/bin/sh

while true; do getty 57600 $(tty); sleep 1; done
