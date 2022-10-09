TARGET=vga.com
OBJS=main.obj
CFLAGS=-ms -0 -q

$(TARGET): $(OBJS)
	wcl $(CFLAGS) -fe=$@ $<

main.obj: main.c util.h vga.h
	wcc $(CFLAGS) -fo=$@ $[.

.NOCHECK
clean:
	-del *.obj
	-del *.err
	-del $(TARGET)
