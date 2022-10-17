#include <stdio.h>
#include <stdarg.h>
#include <time.h>
#include "logger.h"

static FILE *g_fp = stdout;

void logger_init(const char *path)
{
    FILE *fp = NULL;
    if (stdout != g_fp || NULL == path) {
        return;
    }
    fp = fopen(path, "a");
    if (NULL == fp) {
        return;
    }
    g_fp = fp;
}
void logger_close()
{
    if (stdout != g_fp) {
        fclose(g_fp);
        g_fp = stdout;
    }
}
void logger_log(char* file, size_t line, char* fmt, ...)
{
    char datebuf[16], timebuf[16];
    va_list args;
    va_start(args, fmt);
    fprintf(g_fp, "[%s %s][%s:%u]", _strdate(datebuf), _strtime(timebuf), file, line);
    vfprintf(g_fp, fmt, args);
    fputs("\r\n", g_fp);
    fflush(g_fp);
    va_end(args);
}
