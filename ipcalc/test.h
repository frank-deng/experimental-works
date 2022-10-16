#ifndef test_h_
#define test_h_

#include <stdio.h>
#include <string.h>

static size_t failed_count = 0;

#define EXP_TRUE(expr) do { \
    if (expr) { \
        printf("Succeed: %s == true\n", #expr); \
    } else { \
        printf("Failed: %s == false\n", #expr); \
        failed_count++; \
    } \
} while (0)

#define EXP_FALSE(expr) do { \
    if (!expr) { \
        printf("Succeed: %s == false\n", #expr); \
    } else { \
        printf("Failed: %s == false\n", #expr); \
        failed_count++; \
    } \
} while (0)

#define EXP_EQ(val, expr) do { \
    if ((expr) == (val)) { \
        printf("Succeed: %s == %s\n", #expr, #val); \
    } else { \
        printf("Failed: %s == %s\n", #expr, #val); \
        failed_count++; \
    } \
} while (0)

#define EXP_NE(val, expr) do { \
    if ((expr) != (val)) { \
        printf("Succeed: %s != %s\n", #expr, #val); \
    } else { \
        printf("Failed: %s != %s\n", #expr, #val); \
        failed_count++; \
    } \
} while (0)

#define EXP_STREQ(val, expr) do { \
    if (0 == strcmp((expr), (val))) { \
        printf("Succeed: %s streq %s\n", #expr, #val); \
    } else { \
        printf("Failed: %s streq %s\n", #expr, #val); \
        failed_count++; \
    } \
} while (0)

#endif
