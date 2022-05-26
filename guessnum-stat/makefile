OBJS=$(patsubst %.c,%.o,$(wildcard *.c))
HEADERS=$(wildcard *.h)
TARGET=guessnum-stat
LIBS=
CFLAGS=-pthread
ifdef MASTERMIND
CFLAGS+=-DMASTERMIND
TARGET=guessnum-stat-mastermind
endif

.PHONY:clean

${TARGET}: ${OBJS}
	gcc ${CFLAGS} -o $@ $^ ${LIBS}

%.o: %.c ${HEADERS}
	gcc -std=c99 ${CFLAGS} -c -o $@ $<

clean:
	-rm ${OBJS} ${TARGET}
