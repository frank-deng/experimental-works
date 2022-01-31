#ifndef subprocess_h
#define subprocess_h

#include <sys/types.h>

typedef struct {
    pid_t pid;
    int retval;
    int fd_stdin[2];
    int fd_stdout[2];
    int fd_stderr[2];
    FILE* _stdin;
    FILE* _stdout;
    FILE* _stderr;
} subprocess_handle_t;

#ifdef __cplusplus
extern "C" {
#endif

int subprocess_open(subprocess_handle_t *handle, char *const argv[]);
int subprocess_wait(subprocess_handle_t *handle);
void subprocess_close(subprocess_handle_t *handle);

#ifdef __cplusplus
}
#endif

#endif

