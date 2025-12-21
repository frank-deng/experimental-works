import pygame
import sys

class Main:
    __running=True
    def __init__(self):
        pygame.init()
        self.__scr = pygame.display.set_mode((640, 400))

    def run(self):
        while self.__running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.__running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.__running = False


if __name__=='__main__':
    mainProc=Main()
    mainProc.run()

