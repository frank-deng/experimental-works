#!/system/bin/sh

if pidof guessnum-stat; then
    echo "guessnum-stat is running"
    exit 1;
fi

cd /data/guessnum-stat
nohup ./guessnum-stat data.txt &

