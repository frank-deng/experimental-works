TARGET=vga.com
OBJS=main.obj bmp.obj
HEADERS=util.h vga.h
CFLAGS=-ms -0 -q

$(TARGET): $(OBJS)
	wcl $(CFLAGS) -fe=$@ $<

main.obj: main.c $(HEADERS)
	wcc $(CFLAGS) -fo=$@ $[.

bmp.obj: bmp.c $(HEADERS)
	wcc $(CFLAGS) -fo=$@ $[.

.NOCHECK
clean:
	-del *.obj
	-del *.err
	-del $(TARGET)