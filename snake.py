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

board_w=32
board_h=20
HD=0
TL=0
QLEN=board_w*board_h
DR1=DIR_EAST
DR2=DIR_EAST
snake_map=[[0,0] for i in range(board_h+1)]
snake_data=[[0 for _ in range(3)] for _ in range(QLEN)]
food_x=10
food_y=10
score=0
game_over=False

def snake_update_dir():
    global DR2
    if ((DR1==DIR_EAST or DR1==DIR_WEST) and (DR2==DIR_EAST or DR2==DIR_WEST)) or ((DR1==DIR_NORTH or DR1==DIR_SOUTH) and (DR2==DIR_NORTH or DR2==DIR_SOUTH)):
        DR2=DR1

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

def move_head(x_next,y_next):
    global HD,DR1,DR2,game_over
    head=snake_data[HD]
    map_mask = (1 << (x_next & 0xf))
    val = snake_map[y_next][x_next >> 4]
    if (val & map_mask)!=0:
        game_over=True
        return
    snake_map[y_next][x_next >> 4] = (val | map_mask)
    head[2]=DR2
    HD=HD+1
    if HD >= QLEN:
        HD=0
    snake_data[HD][0]=x_next
    snake_data[HD][1]=y_next
    snake_data[HD][2]=DR2
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

def snake_main():
    global DR1,DR2,HD,TL,food_x,food_y,score,game_over
    x_next,y_next,_=snake_data[HD]
    if DR2==DIR_EAST:
        x_next=x_next+1
    elif DR2==DIR_WEST:
        x_next=x_next-1
    elif DR2==DIR_SOUTH:
        y_next=y_next+1
    elif DR2==DIR_NORTH:
        y_next=y_next-1
    if x_next<0 or y_next<0 or x_next>=board_w or y_next>=board_h:
        game_over=True
        return
    if y_next==food_y and x_next==food_x:
        score+=1
        move_head(x_next,y_next)
        nextfood()
        return
    x_tail,y_tail,dir_tail=snake_data[TL]
    scr.addstr(y_tail,x_tail,' ')
    val = snake_map[y_tail][x_tail >> 4]
    map_mask = (1 << (x_tail & 0xf))
    snake_map[y_tail][x_tail >> 4] = (val & (~map_mask))
    TL=TL+1
    if TL>=QLEN:
         TL=0
    x_tail,y_tail,dir_tail=snake_data[TL]
    if dir_tail==DIR_EAST:
        scr.addstr(y_tail,x_tail,'\u257a')
    elif dir_tail==DIR_WEST:
        scr.addstr(y_tail,x_tail,'\u2578')
    elif dir_tail==DIR_NORTH:
        scr.addstr(y_tail,x_tail,'\u2579')
    elif dir_tail==DIR_SOUTH:
        scr.addstr(y_tail,x_tail,'\u257b')
    move_head(x_next,y_next)

def main(stdscr):
    global scr,game_over,DR2,HD
    scr=stdscr
    stdscr.clear()
    stdscr.nodelay(True)
    curses.noecho()
    curses.cbreak()
    stdscr.keypad(True)
    key=-1
    counter=0
    scr.addstr(board_h,0,' '*board_w,curses.A_REVERSE)
    for i in range(board_h+1):
        scr.addstr(i,board_w,' ',curses.A_REVERSE)
    init_len=6
    snake_map[0][0] = (1<<init_len)-1
    for i in range(init_len):
        snake_data[i][0]=i
        snake_data[i][2]=DIR_EAST
        if i==0:
            scr.addstr(0,i,'\u257a')
        elif i>=init_len-1:
            scr.addstr(0,i,'\u2578')
        else:
            scr.addstr(0,i,'\u2501')
    HD=init_len-1
    nextfood()
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
