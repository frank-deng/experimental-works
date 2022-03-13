#include <string.h>
#include "test.h"

#define VERSION_SEG_MAX 500
static int parseVersion(const char *str, size_t segsMax, uint32_t *data)
{
    char *p = str, *next = NULL;
    int i = 0;
    do {
        uint32_t segValue = strtoul(p, &next, 10);
        if (next == p || next == NULL) {
            return 0;
        }
        data[i] = (uint16_t)segValue;
        i++;
        p = next + 1;
    } while (*next != '\0' && i < segsMax);
    while (i < segsMax) {
        data[i] = 0;
        i++;
    }
    return i;
}
int compareVersion(const char *ver0, const char *ver1)
{
    uint32_t verData0[VERSION_SEG_MAX];
    uint32_t verData1[VERSION_SEG_MAX];
    int ret0 = parseVersion(ver0, VERSION_SEG_MAX, verData0);
    int ret1 = parseVersion(ver1, VERSION_SEG_MAX, verData1);
    if (ret0 == 0 || ret1 == 0) {
        return -2;
    }
    for (int i = 0; i < VERSION_SEG_MAX; i++) {
        if (verData0[i] < verData1[i]) {
            return -1;
        } else if (verData0[i] > verData1[i]) {
            return 1;
        }
    }
    return 0;
}

