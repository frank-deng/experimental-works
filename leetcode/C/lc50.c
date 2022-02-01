#include "test.h"

double myPow(double x, int n)
{
    double result = 1;
    if (n < 0) {
        x = 1 / x;
        n = -n;
    }
    while (n) {
        if (n & 1) {
            result *= x;
        }
        n >>= 1;
        x *= x;
    }
    return result;
}
