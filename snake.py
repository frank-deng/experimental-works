#!/usr/bin/env python3

import curses,time
from random import randint as rnd

DIR_EAST=0
DIR_WEST=1
DIR_NORTH=2
DIR_SOUTH=3

scr=None

def get_xy(x,y,dir):
    if dir==DIR_EAST:
        return x+1,y
    elif dir==DIR_WEST:
        return x-1,y
    elif dir==DIR_SOUTH:
        return x,y+1
    elif dir==DIR_NORTH:
        return x,y-1

snake_data=[]
DR1=DIR_EAST
DR2=DIR_EAST
board_w=32
board_h=20
snake_map=[[0,0] for i in range(board_h+1)]
food_x=10
food_y=10
score=0
game_over=False

def snake_update_dir():
    global DR2
    if ((DR1==DIR_EAST or DR1==DIR_WEST) and (DR2==DIR_EAST or DR2==DIR_WEST)) or ((DR1==DIR_NORTH or DR1==DIR_SOUTH) and (DR2==DIR_NORTH or DR2==DIR_SOUTH)):
        DR2=DR1

def snake_init():
    scr.addstr(board_h,0,' '*board_w,curses.A_REVERSE)
    for i in range(board_h+1):
        scr.addstr(i,board_w,' ',curses.A_REVERSE)
    init_len=6
    snake_map[0][0] = (1<<init_len)-1
    for i in range(init_len):
        snake_data.append([i,0,DIR_EAST])
        if i==0:
            scr.addstr(0,i,'\u257a')
        elif i>=init_len-1:
            scr.addstr(0,i,'\u2578')
        else:
            scr.addstr(0,i,'\u2501')
    nextfood()

def nextfood():
    global food_x,food_y
    passed=False
    while not passed:
        food_x=rnd(0,board_w-1)
        food_y=rnd(0,board_h-1)
        passed=True
        map_mask = (1 << (food_x & 0xf))
        val = snake_map[food_y][food_x >> 4]
        if (map_mask & val)!=0:
            passed=False
    scr.addstr(food_y,food_x,'$')

def snake_main():
    global DR1,DR2,food_x,food_y,score,game_over
    head=snake_data[-1]
    x_next,y_next=get_xy(head[0],head[1],DR2)
    map_mask = (1 << (x_next & 0xf))
    val = snake_map[y_next][x_next >> 4]
    if x_next<0 or y_next<0 or x_next>=board_w or y_next>=board_h or (val & map_mask)!=0:
        game_over=True
        return
    snake_map[y_next][x_next >> 4] = (val | map_mask)
    head[2]=DR2
    snake_data.append([x_next,y_next,DR2])

    if (DR1==DIR_EAST and DR2==DIR_EAST) or (DR1==DIR_WEST and DR2==DIR_WEST):
        scr.addstr(head[1],head[0],'\u2501')
    elif (DR1==DIR_NORTH and DR2==DIR_NORTH) or (DR1==DIR_SOUTH and DR2==DIR_SOUTH):
        scr.addstr(head[1],head[0],'\u2503')
    elif (DR1==DIR_NORTH and DR2==DIR_EAST) or (DR1==DIR_WEST and DR2==DIR_SOUTH):
        scr.addstr(head[1],head[0],'\u250f')
    elif (DR1==DIR_NORTH and DR2==DIR_WEST) or (DR1==DIR_EAST and DR2==DIR_SOUTH):
        scr.addstr(head[1],head[0],'\u2513')
    elif (DR1==DIR_SOUTH and DR2==DIR_EAST) or (DR1==DIR_WEST and DR2==DIR_NORTH):
        scr.addstr(head[1],head[0],'\u2517')
    elif (DR1==DIR_SOUTH and DR2==DIR_WEST) or (DR1==DIR_EAST and DR2==DIR_NORTH):
        scr.addstr(head[1],head[0],'\u251b')
    DR1=DR2

    if DR2==DIR_EAST:
        scr.addstr(y_next,x_next,'\u2578')
    elif DR2==DIR_WEST:
        scr.addstr(y_next,x_next,'\u257a')
    elif DR2==DIR_NORTH:
        scr.addstr(y_next,x_next,'\u257b')
    elif DR2==DIR_SOUTH:
        scr.addstr(y_next,x_next,'\u2579')

    if y_next==food_y and x_next==food_x:
        score+=1
        nextfood()
        return

    x_tail,y_tail,dir_tail=snake_data[0]
    scr.addstr(y_tail,x_tail,' ')
    val = snake_map[y_tail][x_tail >> 4]
    map_mask = (1 << (x_tail & 0xf))
    snake_map[y_tail][x_tail >> 4] = (val & (~map_mask))
    snake_data.pop(0)
    x_tail,y_tail,dir_tail=snake_data[0]
    if dir_tail==DIR_EAST:
        scr.addstr(y_tail,x_tail,'\u257a')
    elif dir_tail==DIR_WEST:
        scr.addstr(y_tail,x_tail,'\u2578')
    elif dir_tail==DIR_NORTH:
        scr.addstr(y_tail,x_tail,'\u2579')
    elif dir_tail==DIR_SOUTH:
        scr.addstr(y_tail,x_tail,'\u257b')

def main(stdscr):
    global scr,game_over,DR2
    scr=stdscr
    stdscr.clear()
    stdscr.nodelay(True)
    curses.noecho()
    curses.cbreak()
    stdscr.keypad(True)
    key=-1
    counter=0
    snake_init()
    while key != 27 and not game_over:
        key=stdscr.getch()
        if key==curses.KEY_UP:
            DR2=DIR_NORTH
            snake_update_dir()
        elif key==curses.KEY_DOWN:
            DR2=DIR_SOUTH
            snake_update_dir()
        elif key==curses.KEY_LEFT:
            DR2=DIR_WEST
            snake_update_dir()
        elif key==curses.KEY_RIGHT:
            DR2=DIR_EAST
            snake_update_dir()
        
        stdscr.refresh()
        counter+=1
        time.sleep(0.1)
        if counter>5:
            counter=0
            snake_main()

curses.wrapper(main)
if game_over:
    print('game_over')
print(snake_map)

