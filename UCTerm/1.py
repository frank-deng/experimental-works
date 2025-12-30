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

    def get(self,charCode):
        return self.__bitmap.get(charCode,None)


class TextController(FontManager):
    MODE_80_25=0
    MODE_80_30=1
    ATTR_RIGHT_PART=1
    ATTR_BLINK=2
    ATTR_UNDERLINE=4
    ATTR_STRIKE=8
    def __get_bitmap_pos(self,row,col):
        offset=row*self._cols+col
        bitmap_grp=self.get(self._textRam[offset])
        if bitmap_grp is None:
            return None
        bitmap=None
        attr=self._attrRam[offset]
        if (attr & self.ATTR_RIGHT_PART) and len(bitmap_grp)>0:
            bitmap=bitmap_grp[1]
        else:
            bitmap=bitmap_grp[0]
        return bitmap

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

    def __get_color(self,idx):
        if idx==self.__colorKey:
            return None
        try:
            return self.__palette[idx]
        except KeyError:
            return None

    def __render_cell(self,x,y):
        offset=y*self._cols+x
        attr=self._attrRam[offset]
        bitmap=None
        if not(attr & self.ATTR_BLINK) or self.__counter<=0x10:
            bitmap=self.__get_bitmap_pos(y,x)
        color=self._colorRam[y*self._cols+x]
        bg=self.__get_color((color>>8) & 0xff)
        fg=self.__get_color(color & 0xff)
        if bitmap is not None:
            self.__draw_bitmap(bitmap,x*8,y*16,fg,bg)
        elif bg is not None:
            self.__surface.fill(bg,(x*8,y*16+15,8,1))
        if attr & self.ATTR_UNDERLINE and fg is not None:
            self.__surface.fill(fg,(x*8,y*16+15,8,1))
        if attr & self.ATTR_STRIKE and fg is not None:
            self.__surface.fill(fg,(x*8,y*16+7,8,1))
        if self.__cursorRow==y and self.__cursorCol==x and (self.__counter & 0x7)>4:
            self.__surface.fill(fg,(x*8,y*16+self.__cursorTop,
                8,self.__cursorBottom-self.__cursorTop+1))

    def __init__(self,surface):
        super().__init__()
        self.__surface=surface
        self._textRam=array.array('H',[0]*(80*30))
        self._colorRam=array.array('H',[0]*(80*30))
        self._attrRam=array.array('B',[0]*(80*30))
        self.mode=self.MODE_80_25

    def render(self):
        for y in range(self._rows):
            for x in range(self._cols):
                self.__render_cell(x,y)
        self.__counter=(self.__counter+1)&0x1f

    @property
    def mode(self):
        return self.__mode

    @mode.setter
    def mode(self,mode):
        self.__counter=0
        self.__colorKey=0
        self.__cursorRow=0
        self.__cursorCol=0
        self.__cursorBlink=True
        self.__cursorTop=0
        self.__cursorBottom=15
        for i in range(80*30):
            self._textRam[i]=0
            self._colorRam[i]=7
            self._attrRam[i]=0
        self._cols=80
        if mode==self.MODE_80_25:
            self._rows=25
        elif mode==self.MODE_80_30:
            self._rows=30
        else:
            raise ValueError(f'Invalid mode {mode}')
        self.__palette=[
            (0,0,0,0xff),
            (0x80,0,0,0xff),
            (0,0x80,0,0xff),
            (0x80,0x80,0,0xff),
            (0x80,0,0,0xff),
            (0x80,0,0x80,0xff),
            (0,0x80,0x80,0xff),
            (0xc0,0xc0,0xc0,0xff),
            (0x80,0x80,0x80,0xff),
            (0xff,0,0,0xff),
            (0,0xff,0,0xff),
            (0xff,0xff,0,0xff),
            (0xff,0,0,0xff),
            (0xff,0,0xff,0xff),
            (0,0xff,0xff,0xff),
            (0xff,0xff,0xff,0xff),
        ]
        channelValConv=(0,95,135,175,215,255)
        for b in range(len(channelValConv)):
            for g in range(len(channelValConv)):
                for r in range(len(channelValConv)):
                    self.__palette.append((
                        channelValConv[r],
                        channelValConv[g],
                        channelValConv[b],
                        0xff
                    ))
        for i in range(24):
            v=(i+1)*10
            self.__palette.append((v,v,v,0xff))
        self.__mode=mode

    @property
    def colorkey(self):
        return self.__colorKey

    @colorkey.setter
    def colorkey(self,v):
        self.__colorKey=v

    def cursor_pos(self,row,col):
        self.__cursorRow,self.__cursorCol=row,col

    @property
    def cursor_row(self):
        return self.__cursorRow

    @property
    def cursor_col(self):
        return self.__cursorCol

    def cursor_style(self,**v):
        if 'top' in v:
            self.__cursorTop=v['top']
        if 'bottom' in v:
            self.__cursorBottom=v['bottom']
        if 'blink' in v:
            self.__cursorBlink=v['blink']


class TextLayer(TextController):
    def __write_ram(self,char,part=0):
        offset=self.__row*self._cols+self.__col
        self._textRam[offset]=char
        if self.__inverse:
            self._colorRam[offset]=(self.__fg<<8)|self.__bg
        else:
            self._colorRam[offset]=(self.__bg<<8)|self.__fg
        attr=0
        if part==1:
            attr|=self.ATTR_RIGHT_PART
        if self.__blink:
            attr|=self.ATTR_BLINK
        if self.__underline:
            attr|=self.ATTR_UNDERLINE
        if self.__strike:
            attr|=self.ATTR_STRIKE
        self._attrRam[offset]=attr

        self.__col+=1
        if self.__col>=self._cols:
            self.__col=0
            self.__row=(self.__row+1)%self._rows

    def __init__(self,surface):
        super().__init__(surface)
        self.reset()

    def reset(self):
        self.__row=0
        self.__col=0
        self.__fg=7
        self.__bg=0
        self.__inverse=False
        self.__blink=False
        self.__underline=False
        self.__strike=False

    def text(self,s):
        for ch in s:
            ch=ord(ch)
            bitmap=self.get(ch)
            self.__write_ram(ch)
            if len(bitmap)>1:
                self.__write_ram(ch,1)

    @property
    def pos(self):
        return self.__row,self.__col
        
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

    @property
    def fg(self):
        return self.__fg

    @fg.setter
    def fg(self,v):
        self.__fg=v

    @property
    def bg(self):
        return self.__bg

    @bg.setter
    def bg(self,v):
        self.__bg=v

    @property
    def blink(self):
        return self.__blink

    @blink.setter
    def blink(self,v):
        self.__blink=v


class Main:
    FPS=60
    __running=True
    def __init__(self):
        pygame.init()
        self.__scr = pygame.display.set_mode((640,400))
        self.__clock=pygame.time.Clock()
        self.__gl=pygame.Surface((640,400))
        self.__tl=TextLayer(self.__scr)

    def run(self):
        self.__tl.pos=(24,0)
        self.__tl.fg=0
        self.__tl.bg=7
        self.__tl.text(' '*80)
        self.__tl.fg=7
        self.__tl.bg=0
        self.__tl.pos=(0,0)
        for i in range(10):
            if i&1:
                self.__tl.blink=True
            else:
                self.__tl.blink=False
            self.__tl.text('我的Python')
        self.__gl.fill((0x70,0,0,0xff))
        while self.__running:
            self.__scr.blit(self.__gl,(0,0))
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

