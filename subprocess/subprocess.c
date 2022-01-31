#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>
#include "subprocess.h"

int subprocess_open(subprocess_handle_t *handle, char *const argv[])
{
    // Prepare pipes for stdin, stdout, stderr
    handle->pid = -1;
    handle->_stdin = NULL;
    handle->_stdout = NULL;
    handle->_stderr = NULL;
    if (pipe(handle->fd_stdin) < 0) {
        return 1;
    }
    if (pipe(handle->fd_stdout) < 0) {
        return 1;
    }
    if (pipe(handle->fd_stderr) < 0) {
        return 1;
    }

    // Start subprocess for execute program
    pid_t pid = fork();
    if (-1 == pid) {
        return 2;
    }
    if (0 == pid) {
        // Code for child process
        close(handle->fd_stdin[1]);
        close(handle->fd_stdout[0]);
        close(handle->fd_stderr[0]);
        dup2(handle->fd_stdin[0], STDIN_FILENO);
        close(handle->fd_stdin[0]);
        dup2(handle->fd_stdout[1], STDOUT_FILENO);
        close(handle->fd_stdout[1]);
        dup2(handle->fd_stderr[1], STDERR_FILENO);
        close(handle->fd_stderr[1]);
        if (-1 == execv(argv[0], argv)) {
            return 3;
        }
    }

    // Code for current process
    close(handle->fd_stdin[0]);
    handle->pid = pid;
    handle->_stdin = fdopen(handle->fd_stdin[1], "w");
    if (NULL == handle->_stdin) {
        return 4;
    }
    handle->_stdout = fdopen(handle->fd_stdout[0], "r");
    if (NULL == handle->_stdout) {
        return 4;
    }
    handle->_stderr = fdopen(handle->fd_stderr[0], "r");
    if (NULL == handle->_stderr) {
        return 4;
    }
    return 0;
}
int subprocess_wait(subprocess_handle_t *handle)
{
    fclose(handle->_stdin);
    close(handle->fd_stdin[1]);
    waitpid(handle->pid, &handle->retval, 0);
    close(handle->fd_stdout[1]);
    close(handle->fd_stderr[1]);
    return handle->retval;
}
void subprocess_close(subprocess_handle_t *handle)
{
    fclose(handle->_stdout);
    fclose(handle->_stderr);
    close(handle->fd_stdout[0]);
    close(handle->fd_stderr[0]);
    handle->pid = -1;
    handle->retval = 0;
    handle->_stdin = NULL;
    handle->_stdout = NULL;
    handle->_stderr = NULL;
}

