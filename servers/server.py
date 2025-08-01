#!/usr/bin/env python3

import logging
import sys
import tomllib
import importlib
import asyncio
import signal
import argparse
import fcntl
import atexit
import os
import platform
import time
import ctypes
from util import Logger

from threading import Thread

class Watchdog(Thread,Logger):
    __running=True
    __flag=False
    __task=None
    __timeout=10

    @staticmethod
    def __kill():
        pid=os.getpid()
        if platform.system()=="Windows":
            handle=ctypes.windll.kernel32.OpenProcess(1,0,pid)
            ctypes.windll.kernel32.TerminateProcess(handle,-1)
            ctypes.windll.kernel32.CloseHandle(handle)
        else:
            os.kill(pid,signal.SIGKILL)

    def __init__(self,timeout):
        super().__init__()
        self.__timeout=timeout

    def __enter__(self):
        self.start()
        return self

    def __exit__(self,exc_type,exc_val,exc_tb):
        self.__running=False
        self.join()

    async def __aenter__(self):
        self.__task=asyncio.create_task(self.__feed_task())

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        self.__task.cancel()
        await(self.__task)

    async def __feed_task(self):
        try:
            while self.__running:
                self.__flag=True
                await asyncio.sleep(0.5)
        except asyncio.CancelledError:
            pass

    def run(self):
        try:
            timestamp_feed=time.time()
            timestamp_inner=time.time()
            while self.__running:
                if self.__flag:
                    timestamp_feed=time.time()
                    self.__flag=False
                elif timestamp_inner-timestamp_feed > self.__timeout:
                    logging.getLogger(self.__class__.__name__).critical(
                            f'''Watchdog not fed within {self.__timeout}s, 
    Last fed:{timestamp_feed}, now:{timestamp_inner}''')
                    self.__class__.__kill()
                timestamp_inner=time.time()
                time.sleep(0.5)
        except Exception as e:
            self.logger.error(e,exc_info=True)


class ServerManager(Logger):
    def __init__(self,config):
        self.__conf=config
        self.__servers=[]
        for server_key in config.get('server',{}):
            server_conf=config['server'][server_key]
            server_instance=self.__server_init(server_conf,server_key)
            if server_instance is None:
                continue
            self.__servers.append(server_instance)
        if not len(self.__servers):
            raise RuntimeError('None of the servers has been started')

    def __server_init(self,config,server_key):
        server_instance=None
        try:
            if not config.get('enabled',True):
                return None
            if 'module' not in config:
                raise ValueError('Missing module')
            module_path=config['module']
            selector=None
            if ':' in module_path:
                module_path,selector=module_path.split(':')
            module=importlib.import_module(module_path)
            if selector is not None:
                module=getattr(module,selector)
            server_instance=module(config)
        except Exception as e:
            self.logger.error(f'Failed to load server {server_key}: {e}',
                              exc_info=True)
        return server_instance

    async def __aenter__(self):
        tasks=await asyncio.gather(*[self.__server_aenter(s) \
                for s in self.__servers])
        for i in range(len(tasks)-1,-1,-1):
            _,e=tasks[i]
            if e is not None:
                del self.__servers[i]
        return self

    async def __server_aenter(self,server):
        try:
            res=await server.__aenter__()
            return res,None
        except Exception as e:
            self.logger.error(e,exc_info=True)
            return None,e

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        await asyncio.gather(*[self.__server_aexit(s,exc_type,exc_val,exc_tb) \
                for s in self.__servers])

    async def __server_aexit(self,server,exc_type,exc_val,exc_tb):
        try:
            await server.__aexit__(exc_type,exc_val,exc_tb)
        except Exception as e:
            self.logger.error(e,exc_info=True)

    def close(self):
        for server in self.__servers:
            server.close()


async def main(config,watchdog):
    try:
        async with watchdog:
            async with ServerManager(config) as server_manager:
                register_close_signal(server_manager.close)
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)


def register_close_signal(func):
    loop = asyncio.get_event_loop()
    if 'Windows'==platform.system():
        for s in (signal.SIGINT, signal.SIGTERM):
            signal.signal(s,func)
    else:
        for s in (signal.SIGINT,signal.SIGTERM,signal.SIGQUIT):
            loop.add_signal_handler(s,func)


class DaemonManager:
    __detach=False
    __is_daemon=False
    __pid_file=None
    __pid_fp=None
    def __init__(self,pid_file=None,detach=False):
        self.__detach=detach
        if pid_file is None:
            return
        try:
            self.__pid_fp=open(pid_file,'w')
            fcntl.flock(self.__pid_fp,fcntl.LOCK_EX|fcntl.LOCK_NB)
            atexit.register(self.__exit__)
        except (IOError,OSError,BlockingIOError):
            print(f'Another instance is running',file=sys.stderr)
            exit(1)
        self.__pid_file=pid_file

    def __enter__(self):
        if not self.__do_detach():
            return None
        self.__pid_fp.write(str(os.getpid()))
        self.__pid_fp.flush()
        self.__is_daemon=True
        return self

    def __do_detach(self):
        if not self.__detach or 'Windows'==platform.system():
            return True
        if os.fork():
            return False
        os.setsid()
        os.umask(0)
        if os.fork():
            return False
        sys.stdout.flush()
        sys.stderr.flush()
        with open(os.devnull, 'r') as devnull:
            os.dup2(devnull.fileno(),sys.stdin.fileno())
        with open(os.devnull, 'a') as out:
            os.dup2(out.fileno(),sys.stdout.fileno())
            os.dup2(out.fileno(),sys.stderr.fileno())
        return True

    def __exit__(self,exc_type,exc_val,exc_tb):
        if self.__pid_fp is not None:
            self.__pid_fp.close()
            self.__pid_fp=None
        if self.__is_daemon and self.__pid_file is not None:
            os.remove(self.__pid_file)
            self.__pid_file=None
        atexit.unregister(self.__exit__)


if '__main__'==__name__:
    parser=argparse.ArgumentParser()
    parser.add_argument(
        '--config',
        '-c',
        help='Specify TOML config file.',
        default='server.toml'
    )
    args=parser.parse_args();
    config=None
    try:
        with open(args.config, 'rb') as f:
            config=tomllib.load(f)
    except tomllib.TOMLDecodeError as e:
        print(f'Failed to load {args.config}: {e}',file=sys.stderr)
        exit(1)
    pid_file=config.get('pid_file',None)
    with DaemonManager(pid_file,config.get('detach',False)) as daemon:
        if daemon is None:
            exit(0)
        logging.basicConfig(
            format='[%(asctime)s][%(levelname)s]%(message)s',
            filename=config.get('log_file','server.log'),
            level=getattr(logging,config.get('log_level','INFO'),logging.INFO)
        )
        try:
            with Watchdog(config.get('watchdog_timeout',10)) as watchdog:
                asyncio.run(main(config,watchdog))
            logging.getLogger(__name__).info('Server closed')
        except Exception as e:
            logging.getLogger(__name__).critical(e,exc_info=True)

