OBJS=$(patsubst %.c,%.o,$(wildcard *.c))
HEADERS=$(wildcard *.h)
TARGET=guessnum-stat
LIBS=
ifndef android
CFLAGS=-pthread
endif

ifdef mastermind
CFLAGS+=-DMASTERMIND
TARGET=guessnum-stat-mastermind
endif

${TARGET}: ${OBJS}
	gcc ${CFLAGS} -o $@ $^ ${LIBS}

%.o: %.c ${HEADERS}
	gcc -std=c99 ${CFLAGS} -c -o $@ $<

.PHONY:clean
clean:
	-rm ${OBJS} ${TARGET}