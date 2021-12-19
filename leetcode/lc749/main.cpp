#include <gtest.h>
#include "lc749.h"
using namespace testing;

TEST(containVirus, test0)
{
#define MAP_WIDTH 8
#define MAP_HEIGHT 4
    int mapData[MAP_HEIGHT][MAP_WIDTH] = {
        {0,1,0,0,0,0,0,1},
        {0,1,0,0,0,0,0,1},
        {0,0,0,0,0,0,0,1},
        {0,0,0,0,0,0,0,0},
    };
    int* map[MAP_HEIGHT];
    int widthArr[MAP_HEIGHT];
    for (int i = 0; i < MAP_HEIGHT; i++) {
        map[i] = mapData[i];
        widthArr[i] = MAP_WIDTH;
    }
    EXPECT_EQ(containVirus(map, MAP_HEIGHT, widthArr), 10);
#undef MAP_WIDTH
#undef MAP_HEIGHT
}
TEST(containVirus, test1)
{
#define MAP_WIDTH 3
#define MAP_HEIGHT 3
    int mapData[MAP_HEIGHT][MAP_WIDTH] = {
        {1,1,1},
        {1,0,1},
        {1,1,1},
    };
    int* map[MAP_HEIGHT];
    int widthArr[MAP_HEIGHT];
    for (int i = 0; i < MAP_HEIGHT; i++) {
        map[i] = mapData[i];
        widthArr[i] = MAP_WIDTH;
    }
    EXPECT_EQ(containVirus(map, MAP_HEIGHT, widthArr), 4);
#undef MAP_WIDTH
#undef MAP_HEIGHT
}
int main(int argc, char *argv[])
{
    InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

