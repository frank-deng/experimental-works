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


class GLUtil:
    @staticmethod
    def ortho(left=-1, right=1, bottom=1, top=-1, near=-1, far=1):
        return np.array([
            [2.0/(right-left), 0.0, 0.0, -(right+left)/(right-left)],
            [0.0, 2.0/(top-bottom), 0.0, -(top+bottom)/(top-bottom)],
            [0.0, 0.0, -2.0/(far-near), -(far+near)/(far-near)],
            [0.0, 0.0, 0.0, 1.0]
        ], dtype=np.float32)

    def create_texture(width,height):
        texture_id=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,texture_id)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR)
        glEnable(GL_BLEND);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,width,height,0,GL_RGBA,
            GL_UNSIGNED_BYTE,None)
        fbo = glGenFramebuffers(1)
        glBindFramebuffer(GL_FRAMEBUFFER, fbo)
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
            GL_TEXTURE_2D, texture_id, 0)
        glBindTexture(GL_TEXTURE_2D, 0)
        glBindFramebuffer(GL_FRAMEBUFFER, 0)
        return texture_id,fbo

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


class Layer:
    def __init__(self,width,height):
        self.width=width
        self.height=height
        self._texture,self._fbo=GLUtil.create_texture(width,height)

    def update(self):
        pass

    @property
    def texture(self):
        return self._texture


class GraphicLayer(Layer):
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
        glBindTexture(GL_TEXTURE_2D,self._texture)
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,self.width,self.height,0,
            GL_RGBA,GL_UNSIGNED_BYTE,texture_data)
        glBindTexture(GL_TEXTURE_2D, 0)

    def __init_layer2(self):
        texture_data=np.zeros((self.height,self.width,4),dtype=np.uint8)
        for y in range(self.height):
            for x in range(self.width):
                texture_data[y,x] = [0,0,255*(((self.height-y)/self.height)/2+0.5),255]

        glBindTexture(GL_TEXTURE_2D,self._texture)
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,self.width,self.height,0,
            GL_RGBA,GL_UNSIGNED_BYTE,texture_data)
        glBindTexture(GL_TEXTURE_2D, 0)
            
    def __init__(self,width,height):
        super().__init__(width,height)

    def update(self):
        self.__init_layer2()


class TextLayer(Layer):
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
        uniform usampler2D font;
        uniform usampler2D textram;
        void main() {
            uvec2 scrpos=uvec2(uv*resolution);
            uvec2 celladdr=scrpos/cell_size;
            uvec2 cellxy=scrpos%cell_size;
            uvec4 charinfo=texelFetch(textram,ivec2(celladdr),0);
            //uvec4 charinfo=uvec4(uint(0x30)+(uint(celladdr.y)%10U),0,0,0);
            int fonty=int(charinfo.g*cell_size.y+cellxy.y);
            int fontx=int(charinfo.r*2U+(charinfo.b&1U));
            uint char_row=texelFetch(font,ivec2(fontx,fonty),0).r;
            if (cellxy.x==7U || cellxy.y==15U){
                outColor=vec4(1.0,0.0,0.0,1.0);
            }else if((1<<(int(cell_size.x)-1-int(cellxy.x)) & int(char_row))!=0){
                outColor=vec4(1.0,1.0,1.0,1.0);
            }else{
                outColor=vec4(0.0,0.0,0.0,0.0);
            }
        }
        """
        return compileProgram(
            compileShader(vertex_shader,GL_VERTEX_SHADER),
            compileShader(fragment_shader,GL_FRAGMENT_SHADER)
        )

    def __init_textram(self):
        data=np.zeros((25,80,4),dtype=np.uint8)
        texture=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,texture)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST)
        height,width,_=data.shape
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,width,height,0,
            GL_RGBA,GL_UNSIGNED_BYTE,data)
        glBindTexture(GL_TEXTURE_2D, 0)
        return data,texture

    def __init__(self,width,height):
        super().__init__(width,height)
        self.__shader=self.__create_shader()
        glUseProgram(self.__shader)
        glUniformMatrix4fv(
            glGetUniformLocation(self.__shader,"projection"),
            1,GL_FALSE,GLUtil.ortho()
        )
        self.__vao=GLUtil.vao_fullscr()
        fontLoader=FontLoader()
        self.__font_texture=fontLoader.texture
        glUniform1i(glGetUniformLocation(self.__shader,"font"),0)
        glUniform1i(glGetUniformLocation(self.__shader,"textram"),1)
        glUniform2f(glGetUniformLocation(self.__shader,'resolution'),self.width,self.height)
        glUniform2ui(glGetUniformLocation(self.__shader,'cell_size'),8,16)
        self.__textram,self.__textram_texture=self.__init_textram()
        self.__textram[0,0]=[121,0,0,0]
        self.__textram[0,1]=[121,0,0,0]
        self.__textram[1,0]=[121,0,0,0]
        self.__textram[1,1]=[121,0,0,0]

    def update(self):
        glUseProgram(self.__shader)
        glBindFramebuffer(GL_FRAMEBUFFER, self._fbo)
        glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0, 
            GL_TEXTURE_2D,self._texture,0)
        glViewport(0, 0, self.width, self.height)
        glClearColor(0, 0, 0, 0)
        glClear(GL_COLOR_BUFFER_BIT)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, self.__font_texture)
        glActiveTexture(GL_TEXTURE1)
        glBindTexture(GL_TEXTURE_2D, self.__textram_texture)
        height,width,_=self.__textram.shape
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,width,height,0,
            GL_RGBA,GL_UNSIGNED_BYTE,self.__textram)
        glBindVertexArray(self.__vao)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)
        glBindTexture(GL_TEXTURE_2D, 0)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, 0)
        glBindFramebuffer(GL_FRAMEBUFFER, 0)


class Screen:
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
        uniform sampler2D graphicLayer;
        uniform sampler2D textLayer;
        void main() {
            vec4 color1 = texture(graphicLayer, TexCoord);
            vec4 color2 = texture(textLayer, TexCoord);
            outColor = mix(color1, color2, color2.a);
        }
        """
        return compileProgram(
            compileShader(vertex_shader,GL_VERTEX_SHADER),
            compileShader(fragment_shader,GL_FRAGMENT_SHADER)
        )

    def __init__(self,vw=640,vh=400,width=640,height=400):
        self._vw,self._vh=vw,vh
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR)
        glEnable(GL_BLEND);
        self.__shader=self.__class__.__create_shader()
        self.__texture,self.__fbo=GLUtil.create_texture(width,height)
        glUseProgram(self.__shader)
        glUniformMatrix4fv(
            glGetUniformLocation(self.__shader,"projection"),
            1,GL_FALSE,GLUtil.ortho()
        )
        glUniform1i(glGetUniformLocation(self.__shader,"graphicLayer"),0)
        glUniform1i(glGetUniformLocation(self.__shader,"textLayer"),1)
        self.__vao=GLUtil.vao_fullscr()
        self.__gLayer=GraphicLayer(width,height)
        self.__tLayer=TextLayer(width,height)

    def update(self):
        self.__gLayer.update()
        self.__tLayer.update()
        glUseProgram(self.__shader)
        glViewport(0,0,self._vw,self._vh)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, self.__gLayer.texture)
        glActiveTexture(GL_TEXTURE1)
        glBindTexture(GL_TEXTURE_2D, self.__tLayer.texture)
        glBindVertexArray(self.__vao)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)
        glBindVertexArray(0)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, 0)
        glActiveTexture(GL_TEXTURE1)
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

