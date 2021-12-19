TARGET=lc749.out
OBJS=lc749.o main.o
LIBS=-lgtest -lpthread
CFLAGS=-std=c99 -I/usr/include/gtest -g -Wall

.PHONY:clean test memleak run 

test: ${TARGET}
	gdb ./${TARGET} -ex 'b lc749.c:280' -ex 'r'

memleak: ${TARGET}
	valgrind --leak-check=full ./${TARGET}

run: ${TARGET}
	./${TARGET}

${TARGET}: ${OBJS}
	g++ ${CFLAGS} -o $@ $^ ${LIBS}

main.o: main.cpp
	g++ ${CFLAGS} -c -o $@ $<

lc749.o: lc749.c lc749.h
	gcc ${CFLAGS} -c -o $@ $<

clean:
	-rm ${OBJS} ${TARGET}

