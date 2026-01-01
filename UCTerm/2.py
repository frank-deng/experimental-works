import pygame
import numpy as np
from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GL.shaders import *

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
        # 片段着色器
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

    def __init__(self,width=640,height=400):
        self.width=width
        self.height=height
        glViewport(0,0,width,height)
        self.__shader=self.__create_shader()
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

    def update(self):
        glClearColor(0, 0, 0, 1)
        glClear(GL_COLOR_BUFFER_BIT)
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, self.__texture_id)
        glBindVertexArray(self.__rect_vao)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)
        glBindVertexArray(0)
        glBindTexture(GL_TEXTURE_2D, 0)
        pygame.display.flip()

class Main:
    FPS=60
    __running=True
    def __init__(self):
        pygame.init()
        pygame.display.gl_set_attribute(pygame.GL_CONTEXT_MAJOR_VERSION, 3)
        pygame.display.gl_set_attribute(pygame.GL_CONTEXT_MINOR_VERSION, 3)
        pygame.display.gl_set_attribute(pygame.GL_CONTEXT_PROFILE_MASK, pygame.GL_CONTEXT_PROFILE_CORE)
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
    try:
        mainProc=Main()
        mainProc.run()
    finally:
        pygame.quit()

