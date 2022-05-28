#!/system/bin/sh

EXEC=guessnum-stat
if pidof "${EXEC}"; then
    echo "${EXEC} is running"
    exit 1;
fi
nohup ./${EXEC} data.txt &

