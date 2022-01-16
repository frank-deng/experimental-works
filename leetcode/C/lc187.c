#include "test.h"

#define MATCH_LEN 10
#define DNA_HASH_MAX ((1 << (MATCH_LEN * 2)) - 1)
#define min(a,b) ((a) < (b) ? (a) : (b))

typedef unsigned long dna_t;
int dnaEncode(char src)
{
    switch(src){
        case 'A':
            return 0;
        break;
        case 'T':
            return 1;
        break;
        case 'C':
            return 2;
        break;
        case 'G':
            return 3;
        break;
    }
    return -1;
}
char *dnaDecode(char *buf, dna_t dna){
    char *p = buf + MATCH_LEN - 1;
    for(int i = 0; i < MATCH_LEN; i++, p--){
        switch(dna & 0x3){
            case 0: 
                *p = 'A';
            break;
            case 1:
                *p = 'T';
            break;
            case 2:
                *p = 'C';
            break;
            case 3:
                *p = 'G';
            break;
        }
        dna >>= 2;
    }
    buf[MATCH_LEN] = '\0';
    return buf;
}

typedef struct{
    dna_t value;
    int idx;
    int count;
}dna_item_t;
typedef struct{
    dna_item_t *slot[0xFFF + 1];
}dna_hash_t;
void dna_hash_init(dna_hash_t *target){
    for(int i = 0; i <= 0xFFF; i++){
        target->slot[i] = NULL;
    }
}
void dna_hash_close(dna_hash_t *target){
    for(int i = 0; i <= 0xFFF; i++){
        dna_item_t *p = target->slot[i];
        if(p){
            free(p);
        }
        target->slot[i] = NULL;
    }
}
int dna_hash_add(dna_hash_t *target, dna_t value, int idx)
{
    int slotNum = value & 0xFFF;
    dna_item_t *slot = target->slot[slotNum];
    if(slot == NULL){
        slot = target->slot[slotNum] =
            (dna_item_t*)malloc(sizeof(dna_item_t) * (0xFF + 1));
        for(int i = 0; i <= 0xFF; i++){
            slot[i].count = 0;
        }
    }
    dna_item_t *item = slot + ((value >> 12) & 0xFF);
    if (item->count){
        item->count++;
    } else {
        item->value = value;
        item->count = 1;
        item->idx = idx;
    }
    return item->count;
}
void addValue(char **target, int *length, dna_t dna){
    char *buf = (char*)malloc(sizeof(char)*(MATCH_LEN+1));
    dnaDecode(buf, dna);
    target[*length] = buf;
    (*length)++;
}
char **findRepeatedDnaSequences(const char *s, int *returnSize)
{
    dna_hash_t hashTable;
    dna_t dna = 0;
    char *start = s, *end = s;
    char **result = NULL;
    int i;

    *returnSize = 0;
    if(strlen(s) <= MATCH_LEN){
        return NULL;
    }
    result = (char**)malloc(sizeof(char*) * min(strlen(s) - MATCH_LEN, DNA_HASH_MAX+1));
    if(result == NULL){
        *returnSize = 0;
        return NULL;
    }

    dna_hash_init(&hashTable);
    for(i = 0; i < MATCH_LEN; i++, end++){
        dna <<= 2;
        dna |= dnaEncode(*end);
    }
    dna_hash_add(&hashTable, dna, start - s);
    do{
        dna <<= 2;
        dna |= dnaEncode(*end);
        dna &= DNA_HASH_MAX;
        start++;
        end++;
        if(dna_hash_add(&hashTable, dna, start - s) == 2){
            addValue(result, returnSize, dna);
        }
    }while(*end);
    dna_hash_close(&hashTable);
    return result;
}

