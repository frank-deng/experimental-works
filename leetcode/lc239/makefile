TARGET=lc239.out

${TARGET}: lc239.c
	gcc -std=c99 -g -o $@ $<

.PHONY:test0
test0: ${TARGET}
	./${TARGET} < test0.txt

.PHONY:clean
clean:
	-rm ${TARGET}

