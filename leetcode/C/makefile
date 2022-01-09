OBJS=$(patsubst %.c,%.o,$(wildcard *.c))\
	 $(patsubst %.cpp,%.o,$(wildcard *.test.cpp))\
	 main.o
HEADERS=test.h
TARGET=leetcode_test.out
LIBS=-lgtest -lpthread
CFLAGS=-std=c99 -I/usr/include/gtest -g -Wall

.PHONY:clean debug build valgrind

# Use argument gtest_filter=filter_rule after `make` command to specify the test to run
run: ${TARGET}
	./${TARGET} $(if ${gtest_filter}, --gtest_filter=${gtest_filter})

debug: ${TARGET}
	gdb ./${TARGET}

valgrind: ${TARGET}
	valgrind --leak-check=full ./${TARGET}

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

