OBJS=$(patsubst %.c,%.o,$(wildcard *.c))
HEADERS=$(wildcard *.h)
TARGET=guessnum-stat
TARGET_MASTERMIND=guessnum-stat-mastermind
LIBS=

ifndef android
CFLAGS=-pthread
endif

ifdef mastermind
CFLAGS+=-DMASTERMIND
TARGET=${TARGET_MASTERMIND}
endif

${TARGET}: ${OBJS}
	${CC} ${CFLAGS} -o $@ $^ ${LIBS}

%.o: %.c ${HEADERS}
	${CC} ${CFLAGS} -c -o $@ $<

.PHONY:clean
clean:
	-rm ${OBJS} ${TARGET} ${TARGET_MASTERMIND}

