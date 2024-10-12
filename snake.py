#!/usr/bin/env python3

import curses,time
from random import randint as rnd

DIR_EAST=1
DIR_WEST=-1
DIR_NORTH=-2
DIR_SOUTH=2

scr=None
# x,y

def get_dir(x0,y0,x1,y1):
    if y0 == y1 and (x1-x0) == 1:
        return DIR_EAST
    elif y0 == y1 and (x1-x0) == -1:
        return DIR_WEST
    elif x0 == x1 and (y1-y0) == 1:
        return DIR_SOUTH
    elif x0 == x1 and (y1-y0) == -1:
        return DIR_NORTH
    else:
        return None

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
snake_dir=DIR_EAST
snake_dir_req=None
board_w=32
board_h=20
snake_map=[[0,0] for i in range(board_h+1)]
food_x=10
food_y=10
score=0
game_over=False

def snake_update_dir(dir):
    global snake_dir_req
    if (snake_dir==DIR_EAST or snake_dir==DIR_WEST) and (dir==DIR_NORTH or dir==DIR_SOUTH):
        snake_dir_req=dir
    elif (snake_dir==DIR_NORTH or snake_dir==DIR_SOUTH) and (dir==DIR_EAST or dir==DIR_WEST):
        snake_dir_req=dir
    else:
        snake_dir_req=None

def snake_init():
    scr.addstr(board_h,0,' '*board_w,curses.A_REVERSE)
    for i in range(board_h+1):
        scr.addstr(i,board_w,' ',curses.A_REVERSE)
    init_len=6
    snake_map[0][0] = (1<<init_len)-1
    for i in range(init_len):
        snake_data.append((i,0))
        if i==0:
            scr.addstr(0,i,'\u257a')
        elif i>=init_len-1:
            scr.addstr(0,i,'\u2578')
        else:
            scr.addstr(0,i,'\u2501')
    nextfood()

def nextfood():
    global snake_dir,food_x,food_y,score,snake_data,game_over
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
    global snake_dir,food_x,food_y,score,game_over
    head=snake_data[-1]
    tail=snake_data[0]
    dir_next=snake_dir
    if snake_dir_req is not None:
        dir_next=snake_dir_req
    x_next,y_next=get_xy(head[0],head[1],dir_next)
    map_mask = (1 << (x_next & 0xf))
    val = snake_map[y_next][x_next >> 4]
    if x_next<0 or y_next<0 or x_next>=board_w or y_next>=board_h or (val & map_mask)!=0:
        game_over=True
        return
    snake_map[y_next][x_next >> 4] = (val | map_mask)
    snake_data.append((x_next,y_next))

    if (snake_dir==DIR_EAST and dir_next==DIR_EAST) or (snake_dir==DIR_WEST and dir_next==DIR_WEST):
        scr.addstr(head[1],head[0],'\u2501')
    elif (snake_dir==DIR_NORTH and dir_next==DIR_NORTH) or (snake_dir==DIR_SOUTH and dir_next==DIR_SOUTH):
        scr.addstr(head[1],head[0],'\u2503')
    elif (snake_dir==DIR_NORTH and dir_next==DIR_EAST) or (snake_dir==DIR_WEST and dir_next==DIR_SOUTH):
        scr.addstr(head[1],head[0],'\u250f')
    elif (snake_dir==DIR_NORTH and dir_next==DIR_WEST) or (snake_dir==DIR_EAST and dir_next==DIR_SOUTH):
        scr.addstr(head[1],head[0],'\u2513')
    elif (snake_dir==DIR_SOUTH and dir_next==DIR_EAST) or (snake_dir==DIR_WEST and dir_next==DIR_NORTH):
        scr.addstr(head[1],head[0],'\u2517')
    elif (snake_dir==DIR_SOUTH and dir_next==DIR_WEST) or (snake_dir==DIR_EAST and dir_next==DIR_NORTH):
        scr.addstr(head[1],head[0],'\u251b')
    snake_dir=dir_next

    if dir_next==DIR_EAST:
        scr.addstr(y_next,x_next,'\u2578')
    elif dir_next==DIR_WEST:
        scr.addstr(y_next,x_next,'\u257a')
    elif dir_next==DIR_NORTH:
        scr.addstr(y_next,x_next,'\u257b')
    elif dir_next==DIR_SOUTH:
        scr.addstr(y_next,x_next,'\u2579')

    if y_next==food_y and x_next==food_x:
        score+=1
        nextfood()
        return

    scr.addstr(tail[1],tail[0],' ')
    snake_data.pop(0)
    x_tail,y_tail=snake_data[0]
    val = snake_map[y_tail][x_tail >> 4]
    map_mask = (1 << (x_tail & 0xf))
    snake_map[y_tail][x_tail >> 4] = (val & (~map_mask))
    dir_tail=get_dir(x_tail,y_tail,snake_data[1][0],snake_data[1][1])
    if dir_tail==DIR_EAST:
        scr.addstr(y_tail,x_tail,'\u257a')
    elif dir_tail==DIR_WEST:
        scr.addstr(y_tail,x_tail,'\u2578')
    elif dir_tail==DIR_NORTH:
        scr.addstr(y_tail,x_tail,'\u2579')
    elif dir_tail==DIR_SOUTH:
        scr.addstr(y_tail,x_tail,'\u257b')

def main(stdscr):
    global scr,game_over
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
            snake_update_dir(DIR_NORTH)
        elif key==curses.KEY_DOWN:
            snake_update_dir(DIR_SOUTH)
        elif key==curses.KEY_LEFT:
            snake_update_dir(DIR_WEST)
        elif key==curses.KEY_RIGHT:
            snake_update_dir(DIR_EAST)
        
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

