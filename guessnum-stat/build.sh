#!/system/bin/sh

export PATH='/data/gcc/gcc4.8.2/bin/':$PATH
export CC='arm-linux-androideabi-gcc'

if [ $1 == 'mastermind' ]; then
    MASTERMIND='mastermind=1'
fi

make android=1 ${MASTERMIND}

