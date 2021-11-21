TARGET=lc187

${TARGET}: lc187.c
	gcc -std=c99 -g -o $@ $<

.PHONY:debug
debug: ${TARGET}
	gdb ${TARGET}

.PHONY:test1
test1: ${TARGET}
	./${TARGET} AAAAACCCCCAAAAACCCCCCAAAAAGT

.PHONY:test2
test2: ${TARGET}
	./${TARGET} AAAAAAAAAAA

.PHONY:clean
clean:
	-rm ${TARGET}

