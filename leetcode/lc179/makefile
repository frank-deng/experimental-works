TARGET=lc179

${TARGET}: lc179.c
	gcc -std=c99 -g -o $@ $<

.PHONY:test
test: ${TARGET}
	./${TARGET} 10 2
	./${TARGET} 3 30 34 5 9
	./${TARGET} 1
	./${TARGET} 10
	./${TARGET} 34323 3432

.PHONY:debug
debug: ${TARGET}
	cgdb --args ${TARGET} 24 23 145 12354 124 512 34 1235 423 5 234 34 345 345 324 43

.PHONY:clean
clean:
	-rm ${TARGET}

