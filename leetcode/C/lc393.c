#include "test.h"

#define DATA_1_BYTE 0x7f
#define DATA_SLAVE_BYTE 0x80
#define DATA_2_BYTE 0xC0
#define DATA_3_BYTE 0xE0
#define DATA_4_BYTE 0xF0
#define DATA_5_BYTE_ERROR 0xF8
bool validUtf8(int *data, int dataSize)
{
    int followBytes = 0;
    for (int i = 0; i < dataSize; i++) {
        int value = data[i];
        if (followBytes != 0) {
            if ((value & DATA_SLAVE_BYTE) != DATA_SLAVE_BYTE) {
                return false;
            }
            followBytes--;
            continue;
        }
        if ((value & DATA_5_BYTE_ERROR) == DATA_5_BYTE_ERROR) {
            return false;
        } else if ((value & DATA_4_BYTE) == DATA_4_BYTE) {
            followBytes = 3;
        } else if ((value & DATA_3_BYTE) == DATA_3_BYTE) {
            followBytes = 2;
        } else if ((value & DATA_2_BYTE) == DATA_2_BYTE) {
            followBytes = 1;
        } else if ((value & DATA_1_BYTE) == value) {
            followBytes = 0;
        } else {
            return false;
        }
    }
    return followBytes == 0;
}
