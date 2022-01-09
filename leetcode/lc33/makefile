OBJS_LEETCODE=lc33.o lc179.o
OBJS_LEETCODE_TEST=lc33.test.o lc179.test.o
OBJS=${OBJS_LEETCODE} ${OBJS_LEETCODE_TEST} main.o
HEADERS=test.h
TARGET=leetcode_test.out
LIBS=-lgtest -lpthread
CFLAGS=-std=c99 -I/usr/include/gtest -g -Wall

.PHONY:clean debug build valgrind

debug: ${TARGET}
	./${TARGET}  --gtest_filter=LeetCode_179.*

valgrind: ${TARGET}
	valgrind --leak-check=full ./${TARGET}

build: ${TARGET}

copy: ${TARGET}
	xclip -display :0 -selection c lc33.c

${TARGET}: ${OBJS}
	g++ ${CFLAGS} -o $@ $^ ${LIBS}

main.o: main.cpp
	g++ ${CFLAGS} -c -o $@ $<

%.o: %.c ${HEADERS}
	gcc ${CFLAGS} -c -o $@ $<

%.test.o: %.test.cpp ${HEADERS}
	g++ ${CFLAGS} -c -o $@ $<

clean:
	-rm ${OBJS} ${TARGET}

