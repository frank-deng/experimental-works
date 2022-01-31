#include <stdio.h>

int main(int argc, char *argv[])
{
    printf("1. %s\n", argv[0]);
    printf("2. %s\n", argv[1]);
    char buf[1024] = "empty";
    fgets(buf, 1024, stdin);
    printf("input: %s\n", buf);
    fputs("666666aaa\n", stderr);
    puts("THE END");
    return 0;
}

