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
        layout(location = 1) in vec3 color;
        out vec3 fragColor;
        uniform mat4 projection;
        void main()
        {
            gl_Position = projection * vec4(position, 0.0, 1.0);
            fragColor = color;
        }
        """
        # 片段着色器
        fragment_shader="""
        #version 330 core
        in vec3 fragColor;
        out vec4 outColor;
        void main()
        {
            outColor = vec4(fragColor, 1.0);
        }
        """
        return compileProgram(
            compileShader(vertex_shader,GL_VERTEX_SHADER),
            compileShader(fragment_shader,GL_FRAGMENT_SHADER)
        )
    
    def __create_rect_vao(self):
        # 矩形数据：位置和颜色（使用两个三角形绘制）
        vertices = np.array([
            # 位置     颜色
            -0.5,-0.5,  1.0, 0.0, 0.0,
            0.5,-0.5,  0.0, 1.0, 0.0,
            0.5,0.5,  0.0, 0.0, 1.0,
            -0.5,0.5,  1.0, 1.0, 0.0,
        ], dtype=np.float32)
        indices = np.array([0, 1, 2, 0, 2, 3], dtype=np.uint32)  # 两个三角形索引

        vao = glGenVertexArrays(1)
        vbo = glGenBuffers(1)
        ebo = glGenBuffers(1)

        glBindVertexArray(vao)
        glBindBuffer(GL_ARRAY_BUFFER, vbo)
        glBufferData(GL_ARRAY_BUFFER, vertices.nbytes, vertices, GL_STATIC_DRAW)
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.nbytes, indices, GL_STATIC_DRAW)

        # 位置属性
        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 5 * 4, ctypes.c_void_p(0))
        glEnableVertexAttribArray(0)
        # 颜色属性
        glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 5 * 4, ctypes.c_void_p(2 * 4))
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

    def update(self):
        glClearColor(0, 0, 0, 1)
        glClear(GL_COLOR_BUFFER_BIT)
        glBindVertexArray(self.__rect_vao)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, None)
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

