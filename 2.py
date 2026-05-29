#!/usr/bin/env python3
import asyncio
import urwid

async def main():
    # 用于通知 asyncio 主循环退出
    exit_future = asyncio.Future()

    def handle_input(key):
        if key in ('q', 'Q'):
            exit_future.set_result(None)   # 唤醒等待

    # 构建界面
    menu = urwid.ListBox(urwid.SimpleFocusListWalker([
        urwid.Text("选项1"),
        urwid.Text("选项2")
    ]))
    details = urwid.Text("选中内容将显示在此处")
    layout = urwid.Columns([
        ('fixed', 20, urwid.LineBox(menu, title="菜单")),
        ('weight', 1, urwid.LineBox(details, title="详情"))
    ])
    final_layout = urwid.Frame(
        body=layout,
        header=urwid.Text("Urwid布局示例", align='center'),
        footer=urwid.Text("按Q退出", align='right')
    )

    urwid_loop = urwid.MainLoop(
        final_layout,
        unhandled_input=handle_input,
        event_loop=urwid.AsyncioEventLoop()
    )

    with urwid_loop.start():
        await exit_future   # 等待退出信号

if __name__ == "__main__":
    asyncio.run(main())
