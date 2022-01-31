#include <stdio.h>
#include "subprocess.h"

int main()
{
    char * const args[] = {
        "./test_prog",
        "hahaha"
    };

    subprocess_handle_t handle;
    if (subprocess_open(&handle, args)) {
        fputs("subprocess_open() failed.\n", stderr);
        return 1;
    }

    fputs("新年快乐！！！", handle._stdin);

    printf("Process finished with retval %d.\n", subprocess_wait(&handle));

    char buf[1024] = "";
    while (fgets(buf, sizeof(buf), handle._stdout)) {
        printf("> %s\n", buf);
    }
    while (fgets(buf, sizeof(buf), handle._stderr)) {
        printf("* %s\n", buf);
    }
    subprocess_close(&handle);
    return 0;
}

