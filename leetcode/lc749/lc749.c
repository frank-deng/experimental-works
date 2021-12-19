#include <stdint.h>
#include <string.h>
#include <malloc.h>
#include "lc749.h"

typedef struct {
    uint16_t x;
    uint16_t y;
} getRegionQueueItem_t;
typedef struct {
    size_t start;
    size_t end;
    size_t size;
    getRegionQueueItem_t *data;
} getRegionQueue_t;
int getRegionQueueInit(getRegionQueue_t *queue, size_t size)
{
    queue->start = 0;
    queue->end = 0;
    queue->size = size;
    queue->data = (getRegionQueueItem_t*)malloc(sizeof(getRegionQueueItem_t) * size);
    if (queue->data == NULL) {
        return 0;
    }
    return 1;
}
int getRegionQueueFree(getRegionQueue_t *queue)
{
    queue->start = 0;
    queue->end = 0;
    queue->size = 0;
    if (queue->data != NULL) {
        free(queue->data);
        queue->data = NULL;
    }
}
int getRegionQueuePush(getRegionQueue_t *queue, uint16_t x, uint16_t y)
{
    if ((queue->start != queue->end) &&
        (queue->start % queue->size == queue->end % queue->size)) {
        return 0;
    }
    size_t offset = (queue->start % queue->size);
    getRegionQueueItem_t *item = queue->data + offset;
    item->x = x;
    item->y = y;
    (queue->start)++;
    return 1;
}
int getRegionQueuePop(getRegionQueue_t *queue, uint16_t *x, uint16_t *y)
{
    if (queue->start == queue->end) {
        return 0;
    }
    size_t offset = queue->end % queue->size;
    getRegionQueueItem_t *item = queue->data + offset;
    *x = item->x;
    *y = item->y;
    (queue->end)++;
    return 1;
}

typedef struct {
    uint16_t width;
    uint16_t height;
    uint8_t *data;
} map_t;
int mapCreate(map_t *target, int width, int height)
{
    target->width = width;
    target->height = height;
    target->data = (uint8_t*)malloc(sizeof(uint8_t) * width * height);
    if (target->data == NULL) {
        return 0;
    }
    memset(target->data, 0, sizeof(uint8_t) * width * height);
    return 1;
}
int mapClone(map_t *dest, const map_t* const src)
{
    if (!mapCreate(dest, src->width, src->height)) {
        return 0;
    }
    memcpy(dest->data, src->data, sizeof(uint8_t) * src->width * src->height);
    return 1;
}
void mapFree(map_t *map)
{
    if (map->data != NULL) {
        free(map->data);
    }
    map->data = NULL;
    map->width = 0;
    map->height = 0;
}

#define BIT_PROCESSED 0x80
#define BIT_INFECTED 0x1
#define BIT_INFECT_NEXT 0x2
#define CELL_INFECTED_ACTIVE(n) (((n) & BIT_INFECTED) && !((n) & BIT_PROCESSED))
int findNextPos(map_t *map, uint16_t *x, uint16_t *y)
{
    //找到下一个有毒块
    while (*y < map->height) {
        uint8_t block = map->data[map->width * (*y) + (*x)];
        if (CELL_INFECTED_ACTIVE(block)) {
            break;
        }
        (*x)++;
        if (*x >= map->width) {
            *x = 0;
            (*y)++;
        }
    }
    if (*y >= map->height) {
        *x = *y = 0;
        return 0;
    }
    return 1;
}

typedef struct __region_t_list{
    map_t map;
    int infectNextCount;
    int wallCount;
} region_t;
region_t *getNextRegion(map_t *map, uint16_t *x0, uint16_t *y0)
{
    if (!findNextPos(map, x0, y0)) {
        return NULL;
    }

    region_t* region = (region_t*)malloc(sizeof(region_t));
    region->infectNextCount = region->wallCount = 0;
    if (!mapCreate(&(region->map), map->width, map->height)){
        free(region);
        return NULL;
    }

    getRegionQueue_t queue;
    if (!getRegionQueueInit(&queue, map->width * map->height)){
        return NULL;
    }
    getRegionQueuePush(&queue, *x0, *y0);
    uint16_t x, y;
    while (getRegionQueuePop(&queue, &x, &y)) {
        size_t offset = map->width * y + x;
        uint8_t cell = map->data[offset];
        if (cell & BIT_PROCESSED) {
            continue;
        }
        map->data[offset] |= BIT_PROCESSED;
        if (!(cell & BIT_INFECTED)) {
            region->map.data[offset] |= BIT_INFECT_NEXT;
            (region->infectNextCount)++;
            continue;
        }
        region->map.data[offset] = 1;

        // Left cell
        if (x > 0) {
            getRegionQueuePush(&queue, x - 1, y);
        }
        // Right cell
        if (x < map->width - 1) {
            getRegionQueuePush(&queue, x + 1, y);
        }
        // Top cell
        if (y > 0) {
            getRegionQueuePush(&queue, x, y - 1);
        }
        // Bottom cell
        if (y < map->height - 1) {
            getRegionQueuePush(&queue, x, y + 1);
        }
    }
    getRegionQueueFree(&queue);

    return region;
}
void freeRegion(region_t *region)
{
    mapFree(&(region->map));
    free(region);
}
uint32_t countWalls(const map_t* const map)
{
    uint32_t result = 0;
    for (uint16_t y = 0; y < map->height; y++) {
        for (uint16_t x = 0; x < map->width; x++) {
            uint8_t block = map->data[map->width * y + x];
            //左边的墙
            if (x > 0) {
                uint8_t blockLeft = map->data[map->width * y + (x - 1)];
                if ((blockLeft & BIT_INFECTED) != (block & BIT_INFECTED)) {
                    result++;
                }
            }
            //上边的墙
            if (y > 0) {
                uint8_t blockTop = map->data[map->width * (y - 1) + x];
                if ((blockTop & BIT_INFECTED) != (block & BIT_INFECTED)) {
                    result++;
                }
            }
        }
    }
    return result;
}
void freezeMap(const map_t* map, const map_t* const ref)
{
    for (uint16_t y = 0; y < map->height; y++) {
        for (uint16_t x = 0; x < map->width; x++) {
            size_t offset = map->width * y + x;
            if (ref->data[offset] & BIT_INFECTED) {
                map->data[offset] |= BIT_PROCESSED;
            }
        }
    }
}
void infectMapNext(const map_t* map)
{
    map_t mapOrig;
    mapClone(&mapOrig, map);
    for (uint16_t y = 0; y < map->height; y++) {
        for (uint16_t x = 0; x < map->width; x++) {
            size_t offset = map->width * y + x;
            uint8_t block = mapOrig.data[offset];
            if (x > 0) {
                size_t offsetLeft = map->width * y + (x - 1);
                uint8_t blockLeft = mapOrig.data[offsetLeft];
                if (CELL_INFECTED_ACTIVE(block) ||
                    CELL_INFECTED_ACTIVE(blockLeft)) {
                    map->data[offsetLeft] |= BIT_INFECTED;
                    map->data[offset] |= BIT_INFECTED;
                }
            }
            if (y > 0) {
                size_t offsetTop = map->width * (y - 1) + x;
                uint8_t blockTop = mapOrig.data[offsetTop];
                if (CELL_INFECTED_ACTIVE(block) ||
                    CELL_INFECTED_ACTIVE(blockTop)) {
                    map->data[offsetTop] |= BIT_INFECTED;
                    map->data[offset] |= BIT_INFECTED;
                }
            }
        }
    }
    mapFree(&mapOrig);
}
int processMap(const map_t* mapSrc, uint32_t *wallsAdded)
{
    map_t map;
    region_t *region = NULL, *regionUse = NULL;
    if (!mapClone(&map, mapSrc)){
        return 0;
    }

    uint16_t x = 0, y = 0;
    do{
        region = getNextRegion(&map, &x, &y);
        if (region == NULL) {
            break;
        } else if (regionUse == NULL) {
            regionUse = region;
        } else if (region->infectNextCount > regionUse->infectNextCount) {
            freeRegion(regionUse);
            regionUse = region;
        } else {
            freeRegion(region);
            region = NULL;
        }
    } while (region != NULL);
    mapFree(&map);
    if (regionUse == NULL) {
        return 0;
    }

    *wallsAdded = countWalls(&(regionUse->map));
    freezeMap(mapSrc, &(regionUse->map));
    infectMapNext(mapSrc);

    freeRegion(regionUse);
    return 1;
}
int containVirus(int **mapSrc, int rows, int *colSize)
{
    map_t map;
    int walls = 0;
    uint32_t wallsAdded;
    if (!mapCreate(&map, colSize[0], rows)){
        return 0;
    }
    for (uint16_t y = 0; y < map.height; y++) {
        for (uint16_t x = 0; x < map.width; x++) {
            map.data[map.width * y + x] = (mapSrc[y][x] ? 1 : 0);
        }
    }
    while(processMap(&map, &wallsAdded)){
        walls += wallsAdded;
    }
    mapFree(&map);
    return walls;
}

