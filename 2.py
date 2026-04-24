#!/usr/bin/env python3
"""
使用 urwid 构建的文本输入框程序
- 蓝底白字 (dark blue background, white text)
- 必须使用 asyncio 事件循环
- 演示异步任务（每秒更新状态信息）
"""

import asyncio
import urwid

# 调色板定义：蓝底白字
PALETTE = [
    ('bluebg', 'white', 'dark blue'),   # 普通样式：白字，深蓝背景
]

class BlueInputApp:
    """蓝底白字输入框应用，集成 asyncio 事件循环"""

    def __init__(self):
        # 创建文本输入框，caption 和输入区均应用蓝底白字样式
        self.edit = urwid.Edit(
            ('bluebg', "请输入内容: "),   # 提示文本样式
            ""                          # 初始内容为空
        )

        # 异步信息显示区域（同样蓝底白字）
        self.info_text = urwid.Text(('bluebg', "等待异步任务启动..."))
        info_box = urwid.LineBox(self.info_text, title="异步信息")

        # 布局：输入框在上，信息框在下
        content = urwid.Pile([
            ('pack', self.edit),
            ('pack', info_box),
        ])
        self.view = urwid.Filler(content, valign='top')

        # 主循环引用（后续用于刷新界面）
        self.loop = None

    def run(self):
        """启动应用，必须使用 asyncio 事件循环"""
        # 创建并设置 asyncio 事件循环
        asyncio_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(asyncio_loop)

        # 将 urwid 的事件循环绑定到 asyncio
        urwid_event_loop = urwid.AsyncioEventLoop(loop=asyncio_loop)

        # 构造 urwid 主循环
        self.loop = urwid.MainLoop(
            self.view,
            palette=PALETTE,
            event_loop=urwid_event_loop,
            unhandled_input=self.handle_input  # 处理按键退出
        )

        # 启动一个异步协程，演示 asyncio 与 UI 的协同工作
        asyncio.ensure_future(self.update_info_periodically(), loop=asyncio_loop)

        # 运行主循环（阻塞直到退出）
        self.loop.run()

    async def update_info_periodically(self):
        """异步任务：每隔一秒更新信息区文本，演示 asyncio 不被 UI 阻塞"""
        counter = 0
        while True:
            await asyncio.sleep(1)
            counter += 1
            # 注意：更新 UI 必须在主线程中，由于 asyncio 与 urwid 共享同一线程，此处安全
            self.info_text.set_text(f"程序已运行 {counter} 秒\n当前输入: {self.edit.get_edit_text()}")
            self.loop.draw_screen()  # 刷新界面

    def handle_input(self, key):
        """处理键盘输入，按 Enter 或 Esc 退出程序"""
        if key in ('enter', 'esc'):
            raise urwid.ExitMainLoop()


def main():
    app = BlueInputApp()
    app.run()


if __name__ == '__main__':
    main()
