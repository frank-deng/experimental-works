#!/system/bin/sh

export PATH='/data/gcc/gcc4.8.2/bin/':$PATH
export CC='arm-linux-androideabi-gcc'
make android=1

