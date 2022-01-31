#include "test.h"

typedef enum {
    IGNORE,
    SIGN,
    NUM,
    NOT_A_NUMBER
} char_type_t;
static inline char_type_t getCharType(char c)
{
    if (' ' == c) {
        return IGNORE;
    } else if ('-' == c || '+' == c) {
        return SIGN;
    } else if (c >= '0' && c <= '9') {
        return NUM;
    }
    return NOT_A_NUMBER;
}

typedef enum {
    INITIAL,
    ALLOW_NUM
} state_t;
int myAtoi(const char *s)
{
    int result = 0;
    bool negative = false, running = true;
    state_t state = INITIAL;
    char *p = (char*)s;
    while (*p && running) {
        switch (getCharType(*p)){
            case IGNORE:
                if (INITIAL != state) {
                    running = false;
                }
            break;
            case SIGN:
                if (INITIAL == state) {
                    negative = ('-' == *p);
                    state = ALLOW_NUM;
                } else {
                    running = false;
                }
            break;
            case NUM:
                state = ALLOW_NUM;
                if (result > 214748364) {
                    running = false;
                    result = negative ? -2147483648 : 2147483647;
                    negative = false;
                } else if (result == 214748364 &&
                    ((negative && *p >= '8') || (!negative && *p >= '7'))) {
                    running = false;
                    result = negative ? -2147483648 : 2147483647;
                    negative = false;
                } else {
                    result *= 10;
                    result += (*p - '0');
                }
            break;
            default:
                running = false;
        }
        p++;
    }
    return negative ? -result : result;
}

