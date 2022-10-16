#ifndef ipv4_h_
#define ipv4_h_

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

bool ipv4_pton(const char *, uint32_t *);
int8_t ipv4_get_netmask(uint32_t);
char *ipv4_ntop(uint32_t, char *);

#ifdef __cplusplus
}
#endif

#endif
