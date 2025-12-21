import pygame
import pygame.freetype
import sys
import time

class Main:
    __running=True
    def __init__(self):
        pygame.init()
        self.__scr = pygame.display.set_mode((640, 400))
        self.__tl=pygame.Surface((640,400),pygame.SRCALPHA)
        self.__gl=pygame.Surface((640,400))
        self.__font=pygame.freetype.Font('unifont-17.0.03.pcf',16)

    def run(self):
        self.__tl.fill((0,0,0,0))
        self.__gl.fill((0x70,0,0))
        self.__font.render_to(self.__tl,(0,0),'中西文超级终端',(255,255,255,255))
        self.__scr.blit(self.__gl,(0,0))
        self.__scr.blit(self.__tl,(0,0))
        pygame.display.flip()
        while self.__running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.__running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.__running = False
            time.sleep(0)


if __name__=='__main__':
    mainProc=Main()
    mainProc.run()

