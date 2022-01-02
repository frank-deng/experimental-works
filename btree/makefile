TARGET=btree-test
OBJS=queue.o btree.o main.o
LIBS=-lgtest -lpthread
CFLAGS=-std=c99 -I/usr/include/gtest -g -Wall

.PHONY:clean debug build valgrind

debug: ${TARGET}
	gdb ./${TARGET} -ex 'b main.cpp:19' -ex r

valgrind: ${TARGET}
	valgrind --leak-check=full ./${TARGET}

build: ${TARGET}

copy: ${TARGET}
	xclip -display :0 -selection c lc749.c

${TARGET}: ${OBJS}
	g++ ${CFLAGS} -o $@ $^ ${LIBS}

main.o: main.cpp btree.h queue.h
	g++ ${CFLAGS} -c -o $@ $<

btree.o: btree.c btree.h
	gcc ${CFLAGS} -c -o $@ $<

queue.o: queue.c queue.h
	gcc ${CFLAGS} -c -o $@ $<

clean:
	-rm ${OBJS} ${TARGET}

