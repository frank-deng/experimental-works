import freetype
import pygame
import numpy as np
from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GL.shaders import *


class FontLoader:
    def __load_asc16(self):
        fontData=None
        with open('asc16','rb') as f:
            fontData=f.read()
        if fontData is None:
            raise RuntimeError('Failed to load font ASC16')
        for code in range(0x100):
            try:
                ch=ord(bytes([code]).decode('cp437'))
                row,col=((ch>>8)&0xff)*16, (ch&0xff)*2
                self.__texture_data[row:row+16,col]=np.frombuffer(fontData[code*16:code*16+16],dtype=np.uint8)
            except UnicodeDecodeError:
                pass

    def __load_hzk16(self):
        fontData=None
        with open('CCLIBJ.DOT','rb') as f:
            fontData=f.read()
        if fontData is None:
            raise RuntimeError('Failed to load font CCLIBJ.DOT')
        for qu in range(3):
            for wei in range(94):
                try:
                    ch=ord(bytes((qu+0xa1,wei+0xa1)).decode('gb2312'))
                    offset=(qu*94+wei)*32
                    row,col=((ch>>8)&0xff)*16, (ch&0xff)*2
                    self.__texture_data[row:row+16,col:col+2]=np.frombuffer(fontData[offset:offset+32],dtype=np.uint8).reshape(16,2)
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
            row,col=((code>>8)&0xff)*16, (code&0xff)*2
            ch=code
            font.load_char(ch,freetype.FT_LOAD_RENDER|freetype.FT_LOAD_TARGET_MONO)
            bitmap=font.glyph.bitmap
            if bitmap.width not in (8,16):
                continue
            self.__texture_data[row:row+16,col]=np.frombuffer(bytes(bitmap.buffer[0::bitmap.pitch]),dtype=np.uint8)
            if bitmap.width==16:
                self.__texture_data[row:row+16,col+1]=np.frombuffer(bytes(bitmap.buffer[1::bitmap.pitch]),dtype=np.uint8)

    def __load_font_data(self):
        self.__texture_data=np.zeros((4096,512),dtype=np.uint8)
        self.__load_unifont()
        self.__load_hzk16()
        self.__load_asc16()

    def __init__(self):
        self.__texture_id=None
        self.__load_font_data()

    @property
    def texture(self):
        if self.__texture_id is not None:
            return self.__texture_id
        self.__texture_id=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,self.__texture_id)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST)
        height,width=self.__texture_data.shape
        glTexImage2D(GL_TEXTURE_2D,0,GL_R8UI,width,height,0,
            GL_RED_INTEGER,GL_UNSIGNED_BYTE,
            self.__texture_data.tobytes())
        glBindTexture(GL_TEXTURE_2D, 0)
        return self.__texture_id


class RenderBase:
    @staticmethod
    def ortho(left=-1, right=1, bottom=1, top=-1, near=-1, far=1):
        return np.array([
            [2.0/(right-left), 0.0, 0.0, -(right+left)/(right-left)],
            [0.0, 2.0/(top-bottom), 0.0, -(top+bottom)/(top-bottom)],
            [0.0, 0.0, -2.0/(far-near), -(far+near)/(far-near)],
            [0.0, 0.0, 0.0, 1.0]
        ], dtype=np.float32)

    @staticmethod
    def vao_fullscr():
        vertices = np.array([
            -1,-1,0.0,0.0,
            1,-1,1.0,0.0,
            1,1,1.0,1.0,
            -1,1,0.0,1.0,
        ], dtype=np.float32)
        indices = np.array([0, 1, 2, 0, 2, 3], dtype=np.uint32)

        vao = glGenVertexArrays(1)
        vbo = glGenBuffers(1)
        ebo = glGenBuffers(1)

        glBindVertexArray(vao)
        glBindBuffer(GL_ARRAY_BUFFER, vbo)
        glBufferData(GL_ARRAY_BUFFER, vertices.nbytes, vertices, GL_STATIC_DRAW)
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.nbytes, indices, GL_STATIC_DRAW)

        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 4 * 4, ctypes.c_void_p(0))
        glEnableVertexAttribArray(0)
        glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 4 * 4, ctypes.c_void_p(2 * 4))
        glEnableVertexAttribArray(1)

        glBindVertexArray(0)
        return vao

    def __init__(self,width,height):
        self.width,self.height=width,height
        self._vao=self.__class__.vao_fullscr()


class GraphicRender(RenderBase):
    def __init_layer1(self):
        texture_data=np.zeros((self.height,self.width,4),dtype=np.uint8)
        for y in range(self.height):
            for x in range(self.width):
                if x==0 or x==639 or y==0 or y==399:
                    texture_data[y,x]=[255,0,0,255]
                elif x==1 or x==638 or y==1 or y==398:
                    texture_data[y,x]=[255,255,255,255]
                elif y&1==0:
                    texture_data[y,x] = [0,0,255,255]
                else:
                    texture_data[y,x] = [255,255,0,255]
        glBindTexture(GL_TEXTURE_2D,self._graphic_texture)
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8UI,self.width,self.height,0,
            GL_RGBA_INTEGER,GL_UNSIGNED_BYTE,texture_data)
        glBindTexture(GL_TEXTURE_2D, 0)

    def __init_layer2(self):
        texture_data=np.zeros((self.height,self.width,4),dtype=np.uint8)
        for y in range(self.height):
            for x in range(self.width):
                texture_data[y,x] = [0,0,255*(((self.height-y)/self.height)/2+0.5),255]

        glBindTexture(GL_TEXTURE_2D,self._graphic_texture)
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8UI,self.width,self.height,0,
            GL_RGBA_INTEGER,GL_UNSIGNED_BYTE,texture_data)
        glBindTexture(GL_TEXTURE_2D, 0)

    def __create_texture(self):
        texture_id=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,texture_id)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST)
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8UI,self.width,self.height,0,
            GL_RGBA_INTEGER,GL_UNSIGNED_BYTE,None)
        fbo = glGenFramebuffers(1)
        glBindFramebuffer(GL_FRAMEBUFFER, fbo)
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
            GL_TEXTURE_2D, texture_id, 0)
        glBindTexture(GL_TEXTURE_2D, 0)
        glBindFramebuffer(GL_FRAMEBUFFER, 0)
        return texture_id,fbo
            
    def __init__(self,width,height):
        super().__init__(width,height)
        self._graphic_texture,self.__fbo=self.__create_texture()
        self.__init_layer2()

    def _update(self):
        pass


class TextRender(GraphicRender):
    def __create_shader(self):
        vertex_shader="""
        #version 330 core
        layout(location = 0) in vec2 position;
        layout(location = 1) in vec2 texCoord;
        out vec2 uv;
        uniform mat4 projection;
        void main()
        {
            gl_Position = projection * vec4(position, 0.0, 1.0);
            uv = vec2(texCoord.x,1.0-texCoord.y);
        }
        """
        fragment_shader="""
        #version 330 core
        in vec2 uv;
        out vec4 outColor;
        uniform vec2 resolution;
        uniform uvec2 cell_size;
        uniform usampler2D bg;
        uniform usampler2D font;
        uniform usampler2D textram;
        uniform usampler2D palette;
        vec4 getcolor(uint idx,uvec4 bgcolor){
            uvec4 color=texelFetch(palette,ivec2(int(idx),0),0);
            if(color.a==0U){
                return vec4(bgcolor)/255.0;
            }else{
                return vec4(color)/255.0;
            }
        }
        void main() {
            uint rows=uint(resolution.y/float(cell_size.y));
            uvec2 scrpos=uvec2(uv*resolution);
            uvec2 celladdr=scrpos/cell_size;
            uvec2 cellxy=scrpos%cell_size;
            uvec4 charinfo=texelFetch(textram,ivec2(celladdr),0);
            uvec4 attrinfo=texelFetch(textram,ivec2(int(celladdr.x),int(celladdr.y+rows)),0);
            int fonty=int(charinfo.g*cell_size.y+cellxy.y);
            int fontx=int(charinfo.r*2U+(charinfo.b&1U));
            uint char_row=texelFetch(font,ivec2(fontx,fonty),0).r;
            uvec4 bgcolor=texelFetch(bg,ivec2(scrpos),0);
            if((1<<(int(cell_size.x)-1-int(cellxy.x)) & int(char_row))!=0){
                outColor=getcolor(attrinfo.r,bgcolor);
            }else{
                outColor=getcolor(attrinfo.g,bgcolor);
            }
        }
        """
        return compileProgram(
            compileShader(vertex_shader,GL_VERTEX_SHADER),
            compileShader(fragment_shader,GL_FRAGMENT_SHADER)
        )

    def __create_final_texture(self):
        texture_id=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,texture_id)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR)
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,self.width,self.height,0,
            GL_RGBA,GL_UNSIGNED_BYTE,None)
        fbo = glGenFramebuffers(1)
        glBindFramebuffer(GL_FRAMEBUFFER, fbo)
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
            GL_TEXTURE_2D, texture_id, 0)
        glBindTexture(GL_TEXTURE_2D, 0)
        glBindFramebuffer(GL_FRAMEBUFFER, 0)
        return texture_id,fbo

    def __init_textram(self):
        data=np.zeros((50,80,4),dtype=np.uint8)
        #Init attr part
        data[25:,:,0]=15
        texture=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,texture)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST)
        glBindTexture(GL_TEXTURE_2D, 0)
        return data,texture

    def __init_palette(self):
        data=np.zeros((1,256,4),dtype=np.uint8)
        data[0,0:16]=[
            (0,0,0,0),
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
        idx=16
        channelValConv=(0,95,135,175,215,255)
        for b in range(len(channelValConv)):
            for g in range(len(channelValConv)):
                for r in range(len(channelValConv)):
                    data[0,idx]=(channelValConv[r],channelValConv[g],
                        channelValConv[b],0xff)
                    idx+=1
        for i in range(24):
            v=(i+1)*10
            data[0,idx]=(v,v,v,0xff)
            idx+=1
        if idx!=256:
            raise AssertionError('Palette entries inited not 256')

        texture=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,texture)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST)
        glBindTexture(GL_TEXTURE_2D, 0)
        return data,texture

    def __init__(self,width,height):
        super().__init__(width,height)
        self._final_texture,self._fbo=self.__create_final_texture()
        self.__font_texture=FontLoader().texture
        self.__textram,self.__textram_texture=self.__init_textram()
        self.__palette,self.__palette_texture=self.__init_palette()

        self.__shader=self.__create_shader()
        glUseProgram(self.__shader)
        glUniformMatrix4fv(
            glGetUniformLocation(self.__shader,"projection"),
            1,GL_FALSE,self.__class__.ortho()
        )
        glUniform1i(glGetUniformLocation(self.__shader,"bg"),0)
        glUniform1i(glGetUniformLocation(self.__shader,"font"),1)
        glUniform1i(glGetUniformLocation(self.__shader,"textram"),2)
        glUniform1i(glGetUniformLocation(self.__shader,"palette"),3)
        glUniform2f(glGetUniformLocation(self.__shader,'resolution'),self.width,self.height)
        glUniform2ui(glGetUniformLocation(self.__shader,'cell_size'),8,16)
        height,width,_=self.__textram.shape
        for row in range(height>>1):
            for col in range(width):
                self.__textram[row,col]=[0x30+(row+col)%10,0,0,0]

        glBindTexture(GL_TEXTURE_2D, self.__textram_texture)
        height,width,_=self.__textram.shape
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8UI,width,height,0,
            GL_RGBA_INTEGER,GL_UNSIGNED_BYTE,self.__textram)
        glBindTexture(GL_TEXTURE_2D, self.__palette_texture)
        height,width,_=self.__palette.shape
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8UI,width,height,0,
            GL_RGBA_INTEGER,GL_UNSIGNED_BYTE,self.__palette)
        glBindTexture(GL_TEXTURE_2D, 0)

    def _update(self):
        super()._update()
        glUseProgram(self.__shader)
        glBindFramebuffer(GL_FRAMEBUFFER, self._fbo)
        glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0, 
            GL_TEXTURE_2D,self._final_texture,0)
        glViewport(0, 0, self.width, self.height)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, self._graphic_texture)
        glActiveTexture(GL_TEXTURE1)
        glBindTexture(GL_TEXTURE_2D, self.__font_texture)
        glActiveTexture(GL_TEXTURE2)
        glBindTexture(GL_TEXTURE_2D, self.__textram_texture)
        glActiveTexture(GL_TEXTURE3)
        glBindTexture(GL_TEXTURE_2D, self.__palette_texture)
        glBindVertexArray(self._vao)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)
        glBindTexture(GL_TEXTURE_2D, 0)
        glActiveTexture(GL_TEXTURE2)
        glBindTexture(GL_TEXTURE_2D, 0)
        glActiveTexture(GL_TEXTURE1)
        glBindTexture(GL_TEXTURE_2D, 0)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, 0)
        glBindFramebuffer(GL_FRAMEBUFFER, 0)


class Screen(TextRender):
    @staticmethod
    def __create_shader():
        vertex_shader="""
        #version 330 core
        layout(location = 0) in vec2 position;
        layout(location = 1) in vec2 texCoord;
        out vec2 TexCoord;
        uniform mat4 projection;
        void main()
        {
            gl_Position = projection * vec4(position, 0.0, 1.0);
            TexCoord = texCoord;
        }
        """
        fragment_shader="""
        #version 330 core
        in vec2 TexCoord;
        out vec4 outColor;
        uniform sampler2D textureScreen;
        void main() {
            outColor = texture(textureScreen,TexCoord);
        }
        """
        return compileProgram(
            compileShader(vertex_shader,GL_VERTEX_SHADER),
            compileShader(fragment_shader,GL_FRAGMENT_SHADER)
        )

    def __init__(self,vw=640,vh=400,width=640,height=400):
        super().__init__(width,height)
        self._vw,self._vh=vw,vh
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR)
        glDisable(GL_BLEND)
        self.__shader=self.__class__.__create_shader()
        glUseProgram(self.__shader)
        glUniformMatrix4fv(
            glGetUniformLocation(self.__shader,"projection"),
            1,GL_FALSE,self.__class__.ortho()
        )

    def update(self):
        self._update()
        glUseProgram(self.__shader)
        glViewport(0,0,self._vw,self._vh)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, self._final_texture)
        glBindVertexArray(self._vao)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)
        glBindVertexArray(0)
        glBindTexture(GL_TEXTURE_2D, 0)
        glUseProgram(0)
        pygame.display.flip()


class Main:
    FPS=60
    __running=True
    def __init__(self):
        pygame.init()
        pygame.display.gl_set_attribute(pygame.GL_CONTEXT_MAJOR_VERSION, 3)
        pygame.display.gl_set_attribute(pygame.GL_CONTEXT_MINOR_VERSION, 3)
        pygame.display.gl_set_attribute(pygame.GL_CONTEXT_PROFILE_MASK, pygame.GL_CONTEXT_PROFILE_CORE)
        pygame.display.set_mode((1024,600),
            pygame.OPENGL|pygame.DOUBLEBUF)
        self.__clock=pygame.time.Clock()
        self.__scr=Screen(1024,600,640,400)

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
    try:
        mainProc=Main()
        mainProc.run()
    finally:
        pygame.quit()

