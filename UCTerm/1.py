import pygame
import freetype
import sys
import time
import array

class FontManager:
    def __load_asc16(self):
        fontData=None
        with open('asc16','rb') as f:
            fontData=f.read()
        if fontData is None:
            raise RuntimeError('Failed to load font ASC16')
        for code in range(0x100):
            try:
                ch=ord(bytes([code]).decode('cp437'))
                self.__bitmap[ch]=(fontData[code*16:code*16+16],)
            except UnicodeDecodeError:
                pass

    def __load_hzk16(self):
        fontData=None
        with open('CCLIBJ.DOT','rb') as f:
            fontData=f.read()
        for qu in range(3):
            for wei in range(94):
                try:
                    ch=ord(bytes((qu+0xa1,wei+0xa1)).decode('gb2312'))
                    offset=(qu*94+wei)*32
                    bitmap=fontData[offset:offset+32]
                    self.__bitmap[ch]=(bytes(bitmap[0::2]),bytes(bitmap[1::2]))
                except UnicodeDecodeError:
                    pass

    def __load_unifont(self):
        font=freetype.Face('unifont.pcf')
        font.set_pixel_sizes(0,16)
        for code in range(0x10000):
            if (code>=0xd800 and code<=0xf8ff) or\
                (code>=0x0590 and code<=0x109f) or\
                (code>=0x1780 and code<=0x1cff) or\
                (code>=0xfb50 and code<=0xfdff) or\
                (code>=0xfe70 and code<=0xfeff):
                continue
            ch=code
            font.load_char(ch,freetype.FT_LOAD_RENDER|freetype.FT_LOAD_TARGET_MONO)
            bitmap=font.glyph.bitmap
            if bitmap.width not in (8,16):
                continue
            if bitmap.width==8:
                self.__bitmap[ch]=(bytes(bitmap.buffer[0::bitmap.pitch]),)
                continue
            self.__bitmap[ch]=(
                bytes(bitmap.buffer[0::bitmap.pitch]),
                bytes(bitmap.buffer[1::bitmap.pitch]),
            )

    def __init__(self):
        self.__bitmap={}
        self.__load_unifont()
        self.__load_hzk16()
        self.__load_asc16()

    def get(self,char,part=0):
        if char not in self.__bitmap:
            return b'\0'*16
        bitmap_grp=self.__bitmap[char]
        bitmap=None
        if len(bitmap_grp)>1:
            bitmap=bitmap_grp[part]
        else:
            bitmap=bitmap_grp[0]
        return bitmap


class TextLayer(FontManager):
    MODE_80_25=0
    MODE_160_50=1
    ATTR_RIGHT_PART=1
    ATTR_INVERSE=2
    ATTR_BLINK=4
    ATTR_UNDERLINE=8
    ATTR_STRIKE=16
    def __init__(self,surface):
        super().__init__()
        self.__surface=surface
        self.__textRam=array.array('H',[0]*(160*50))
        self.__colorRam=array.array('H',[0]*(160*50))
        self.__attrRam=array.array('B',[0]*(160*50))
        self.__counter=0
        self.__row=0
        self.__col=0
        self.__stride=80
        self.__mode=self.MODE_80_25
        self.__fg=7
        self.__bg=None

    @property
    def mode(self):
        return self.__mode

    @mode.setter
    def mode(self,mode):
        self.__counter=0
        self.__row=0
        self.__col=0
        for i in range(160*50):
            self.__textRam[i]=0
            self.__colorRam[i]=7
            self.__attrRam[i]=0
        if mode==self.MODE_80_25:
            self.__stride=80
        elif mode==self.MODE_160_50:
            self.__stride=160
        else:
            raise ValueError(f'Invalid mode {mode}')

    def onFrame(self):
        self.__counter=(self.__counter+1) % 60

    def render(self,char):
        self.render_to(self.__surface,self.get(ord(char),0),(0,0),(255,255,255,255))
        self.render_to(self.__surface,self.get(ord(char),1),(8,0),(255,255,255,255))
        print(self.get(ord('A'),0))
        self.render_to(self.__surface,self.get(ord('A'),0),(16,0),(255,255,255,255))

    def render_to(self,surface,bitmap,pos,fg,bg=None):
        x0,y0=pos
        if fg is None:
            fg=(0,0,0,0)
        if bg is None:
            bg=(0,0,0,0)
        for y in range(y0,y0+16):
            i=7
            for x in range(x0,x0+8):
                if (1<<i) & bitmap[y]:
                    surface.set_at((x,y),fg)
                else:
                    surface.set_at((x,y),bg)
                i=i-1
        return True

class Main:
    __running=True
    def __init__(self):
        pygame.init()
        self.__scr = pygame.display.set_mode((640, 400))
        self.__gl=pygame.Surface((640,400))
        self.__tl=TextLayer(self.__scr)

    def run(self):
        #self.__tl.fill((0,0,0,0))
        #self.__tl.fill((0xa8,0xa8,0xa8,255),(0,16*24,640,16))

        self.__scr.fill((0x70,0,0))
        self.__scr.blit(self.__gl,(0,0))
        self.__tl.render('我')
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

