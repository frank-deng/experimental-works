TARGET=subprocess_demo
OBJS=subprocess.o main.o
TARGET_TEST=test_prog
OBJS_TEST=test.o
CFLAGS=-g -Wall

.PHONY: clean build

build: ${TARGET} ${TARGET_TEST}

${TARGET}: ${OBJS}
	gcc ${CFLAGS} -o $@ $^

${TARGET_TEST}: ${OBJS_TEST}
	gcc ${CFLAGS} -o $@ $^

%.o: %.c ${HEADERS}
	gcc -std=gnu99 ${CFLAGS} -c -o $@ $<

clean:
	-rm ${OBJS} ${TARGET} ${OBJS_TEST} ${TARGET_TEST}

