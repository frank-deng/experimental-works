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
                (code>=0xfe70 and code<=0xfeff) or\
                code<0x20:
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

    def get(self,char):
        return self.__bitmap.get(char,None)


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
        self.mode=self.MODE_80_25

    @property
    def mode(self):
        return self.__mode

    @mode.setter
    def mode(self,mode):
        self.__counter=0
        self.__row=0
        self.__col=0
        self.__fg=7
        self.__bg=None
        self.__inverse=False
        self.__blink=False
        self.__underline=False
        self.__strike=False
        for i in range(160*50):
            self.__textRam[i]=0
            self.__colorRam[i]=7
            self.__attrRam[i]=0
        if mode==self.MODE_80_25:
            self.__cols=80
            self.__rows=25
        elif mode==self.MODE_160_50:
            self.__cols=160
            self.__rows=50
        else:
            raise ValueError(f'Invalid mode {mode}')
        self.__mode=mode

    def __write_ram(self,char,part=0):
        offset=self.__row*self.__cols+self.__col
        self.__textRam[offset]=char
        attr=0
        if part:
            attr|=self.ATTR_RIGHT_PART
        self.__attrRam[offset]=attr
        self.__col+=1
        if self.__col>=self.__cols:
            self.__col=0
            self.__row=(self.__row+1)%self.__rows

    def __get_bitmap_pos(self,row,col):
        offset=row*self.__cols+col
        bitmap_grp=self.get(self.__textRam[offset])
        if bitmap_grp is None:
            return None
        attr=self.__attrRam[offset]
        if (attr & self.ATTR_RIGHT_PART) and len(bitmap_grp)>0:
            return bitmap_grp[1]
        else:
            return bitmap_grp[0]

    def __draw_bitmap(self,bitmap,x0,y0,fg,bg=None):
        for y in range(16):
            for x in range(8):
                if (1<<(7-x)) & bitmap[y]:
                    if fg is not None:
                        self.__surface.set_at((x0+x,y0+y),fg)
                else:
                    if bg is not None:
                        self.__surface.set_at((x0+x,y0+y),bg)
        return True

    def text(self,s):
        for ch in s:
            ch=ord(ch)
            bitmap=self.get(ch)
            self.__write_ram(ch)
            if len(bitmap)>1:
                self.__write_ram(ch,1)

    def render(self):
        self.__counter=(self.__counter+1) % 60
        for y in range(self.__rows):
            for x in range(self.__cols):
                bitmap=self.__get_bitmap_pos(y,x)
                if bitmap is None:
                    continue
                self.__draw_bitmap(bitmap,x*8,y*16,(255,255,255,255))

    @property
    def pos(self):
        return (self.__row,self.__col)
        
    @pos.setter
    def pos(self,val):
        self.__row,self.__col=val

    @property
    def row(self):
        return self.__row

    @row.setter
    def row(self,v):
        self.__row=v

    @property
    def col(self):
        return self.__col

    @col.setter
    def row(self,v):
        self.__col=v



class Main:
    FPS=120
    __running=True
    def __init__(self):
        pygame.init()
        self.__scr = pygame.display.set_mode((640, 400))
        self.__clock=pygame.time.Clock()
        self.__gl=pygame.Surface((640,400))
        self.__tl=TextLayer(self.__scr)

    def run(self):
        while self.__running:
            self.__scr.fill((0x70,0,0))
            self.__scr.blit(self.__gl,(0,0))
            for i in range(20):
                self.__tl.text('我的Python')

            self.__tl.render()
            pygame.display.flip()
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.__running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key in (pygame.K_ESCAPE,pygame.K_q):
                        self.__running = False
            self.__clock.tick(self.FPS)


if __name__=='__main__':
    mainProc=Main()
    mainProc.run()

