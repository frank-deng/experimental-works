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
    def texture_id(self):
        if self.__texture_id is not None:
            return self.__texture_id
        self.__texture_id=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,self.__texture_id)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST)
        glTexImage2D(GL_TEXTURE_2D,0,GL_R8UI,512,4096,0,
            GL_RED_INTEGER,GL_UNSIGNED_BYTE,
            self.__texture_data.tobytes())
        glBindTexture(GL_TEXTURE_2D, 0)
        return self.__texture_id


class Screen:
    @staticmethod
    def __ortho(left, right, bottom, top, near, far):
        return np.array([
            [2.0/(right-left), 0.0, 0.0, -(right+left)/(right-left)],
            [0.0, 2.0/(top-bottom), 0.0, -(top+bottom)/(top-bottom)],
            [0.0, 0.0, -2.0/(far-near), -(far+near)/(far-near)],
            [0.0, 0.0, 0.0, 1.0]
        ], dtype=np.float32)

    def __create_shader(self):
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
        uniform sampler2D textureSampler;
        void main()
        {
            outColor = texture(textureSampler, TexCoord);
        }
        """
        return compileProgram(
            compileShader(vertex_shader,GL_VERTEX_SHADER),
            compileShader(fragment_shader,GL_FRAGMENT_SHADER)
        )

    def __create_shader_textlayer(self):
        vertex_shader="""
        #version 330 core
        layout(location = 0) in vec2 position;
        layout(location = 1) in vec2 texCoord;
        out vec2 uv;
        uniform mat4 projection;
        void main()
        {
            gl_Position = projection * vec4(position, 0.0, 1.0);
            uv = texCoord;
        }
        """
        fragment_shader="""
        #version 330 core
        in vec2 uv;
        out vec4 outColor;
        uniform vec2 resolution;
        uniform ivec2 cell_size;
        void main()
        {
            ivec2 scrpos=ivec2(uv*resolution);
            if((scrpos.x & 1)!=0){
                outColor=vec4(1.0,0.0,0.0,1.0);
            }else if((scrpos.y & 1)!=0){
                outColor=vec4(0.0,1.0,0.0,1.0);
            }else{
                outColor=vec4(0.0,0.0,0.0,0.0);
            }
        }
        """
        return compileProgram(
            compileShader(vertex_shader,GL_VERTEX_SHADER),
            compileShader(fragment_shader,GL_FRAGMENT_SHADER)
        )

    def __create_texture(self):
        texture_data=np.zeros((400,640,4),dtype=np.uint8)
        for y in range(400):
            for x in range(640):
                if x==0 or x==639 or y==0 or y==399:
                    texture_data[y,x]=[255,0,0,255]
                elif x==1 or x==638 or y==1 or y==398:
                    texture_data[y,x]=[255,255,255,255]
                elif y&1==0:
                    texture_data[y,x] = [255,0,0,255]
                else:
                    texture_data[y,x] = [0,255,0,255]

        # 生成纹理
        texture_id=glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D,texture_id)

        # 设置纹理参数
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR)
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR)

        # 加载纹理数据
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 640, 400, 0,
            GL_RGBA, GL_UNSIGNED_BYTE, texture_data)

        # 生成mipmap（可选）
        #glGenerateMipmap(GL_TEXTURE_2D)

        glBindTexture(GL_TEXTURE_2D, 0)
        return texture_id
    
    def __create_rect_vao(self):
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

    def __init__(self,vw=640,vh=400,width=640,height=400):
        self.width=width
        self.height=height
        glViewport(0,0,vw,vh)
        self.__shader=self.__create_shader()
        self.__shader_text=self.__create_shader_textlayer()

        glUseProgram(self.__shader)
        proj_loc = glGetUniformLocation(self.__shader, "projection")
        glUniformMatrix4fv(proj_loc, 1, GL_FALSE,
            self.__class__.__ortho(-1,1,-1,1,-1,1))
        self.__rect_vao=self.__create_rect_vao()
        self.__texture_id=self.__create_texture()
        glUseProgram(self.__shader)
        glUniform1i(glGetUniformLocation(self.__shader, "textureSampler"), 0)
        glEnable(GL_BLEND)
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)

        glUseProgram(self.__shader_text)
        proj_loc = glGetUniformLocation(self.__shader_text, "projection")
        glUniformMatrix4fv(proj_loc, 1, GL_FALSE,
            self.__class__.__ortho(-1,1,-1,1,-1,1))
        fontLoader=FontLoader()
        self.__font_texture_id=fontLoader.texture_id
        glEnable(GL_BLEND)
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)

        error = glGetError()
        if error != GL_NO_ERROR:
            print(f"OpenGL error during initialization: {error}")

    def update(self):
        glClearColor(0, 0, 0, 1)
        glClear(GL_COLOR_BUFFER_BIT)
        glUseProgram(self.__shader)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, self.__texture_id)
        glBindVertexArray(self.__rect_vao)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)

        glUseProgram(self.__shader_text)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, self.__font_texture_id)
        glBindVertexArray(self.__rect_vao)
        glUniform2f(glGetUniformLocation(self.__shader_text,'resolution'),self.width,self.height)
        glUniform2i(glGetUniformLocation(self.__shader_text,'cell_size'),8,16)
        #glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)

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

