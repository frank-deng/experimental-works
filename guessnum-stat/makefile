OBJS=$(patsubst %.c,%.o,$(wildcard *.c))
CC=/data/gcc/gcc
HEADERS=guessnum.h
TARGET=guessnum-stat
LIBS=
CFLAGS=

.PHONY:clean

${TARGET}: ${OBJS}
	gcc ${CFLAGS} -o $@ $^ ${LIBS}

%.o: %.c ${HEADERS}
	gcc -std=c99 ${CFLAGS} -c -o $@ $<

clean:
	-rm ${OBJS} ${TARGET}
