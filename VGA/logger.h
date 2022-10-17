#ifndef __logger_h__
#define __logger_h__

#define LOG(fmt, ...) do{\
    logger_log(__FILE__, __LINE__, (fmt), __VA_ARGS__); \
}while(0)

#ifdef __cplusplus
extern "C" {
#endif

void logger_init(const char*);
void logger_close();
void logger_log(char*, size_t, char*, ...);

#ifdef __cplusplus
}
#endif

#endif