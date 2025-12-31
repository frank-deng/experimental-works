import pygame
import numpy as np
from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GL.shaders import *

class Screen:
    def __init__(self,width=640,height=400):
        self.width=width
        self.height=height
        glViewport(0,0,width,height)
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluOrtho2D(0,width,height,0)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()

    def update(self):
        glClearColor(0, 0, 0, 1)
        glClear(GL_COLOR_BUFFER_BIT)

        # 立即模式绘制三角形
        glBegin(GL_TRIANGLES)
        glColor3f(1, 0, 0)
        glVertex2f(400, 150)
        glColor3f(1, 0, 0)
        glVertex2f(200, 450)
        glColor3f(1, 0, 0)
        glVertex2f(600, 450)
        glEnd()

        # 绘制矩形
        glBegin(GL_QUADS)
        glColor3f(1, 1, 0)
        glVertex2f(100, 100)
        glVertex2f(200, 100)
        glVertex2f(200, 200)
        glVertex2f(100, 200)
        glEnd()
        pygame.display.flip()

class Main:
    FPS=60
    __running=True
    def __init__(self):
        pygame.init()
        print(pygame.display.Info())
        pygame.display.set_mode((640,400),
            pygame.OPENGL|pygame.DOUBLEBUF)
        self.__clock=pygame.time.Clock()
        self.__scr=Screen(640,400)

    def run(self):
        while self.__running:
            self.__scr.update()
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.__running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key in (pygame.K_ESCAPE,pygame.K_q):
                        self.__running = False
            self.__clock.tick(self.FPS)


if __name__=='__main__':
    mainProc=Main()
    try:
        mainProc.run()
    finally:
        pygame.quit()

