guessnum-stat : guessnum-stat.o
	gcc -O3 -pthread -o $@ $^

guessnum-stat.o : guessnum-stat.c guessnum-stat.h
	gcc -O3 -pthread -c -o $@ $<

.PHONY:clean
clean:
	-rm *.o guessnum-stat

