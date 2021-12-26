TARGET=lc749.out
OBJS=lc749.o main.o
LIBS=-lgtest -lpthread
CFLAGS=-std=c99 -I/usr/include/gtest -g -Wall

.PHONY:clean debug build valgrind

debug: ${TARGET}
	gdb -ex 'b lc749.c:304' -ex 'r' --args ./${TARGET} --gtest_filter=*.test3

valgrind: ${TARGET}
	valgrind --leak-check=full ./${TARGET}

build: ${TARGET}

copy: ${TARGET}
	xclip -display :0 -selection c lc749.c

${TARGET}: ${OBJS}
	g++ ${CFLAGS} -o $@ $^ ${LIBS}

main.o: main.cpp
	g++ ${CFLAGS} -c -o $@ $<

lc749.o: lc749.c lc749.h
	gcc ${CFLAGS} -c -o $@ $<

clean:
	-rm ${OBJS} ${TARGET}

