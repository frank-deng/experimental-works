import sys
import platform
import os
import atexit
import errno
import fcntl
import signal
import functools

class DaemonIsRunningError(RuntimeError):
    pass

class DaemonNotRunningError(RuntimeError):
    pass

class DaemonAbnormalExitError(RuntimeError):
    pass

class DaemonManager:
    __detach=False
    __is_daemon=False
    __pid_file=None
    __pid_fp=None
    def __init__(self,pid_file:str=None,detach:bool=False):
        self.__detach=detach
        if pid_file is None:
            return
        try:
            self.__pid_fp=open(pid_file,'w')
            fcntl.flock(self.__pid_fp,fcntl.LOCK_EX|fcntl.LOCK_NB)
            atexit.register(self.__exit__)
        except (IOError,OSError,BlockingIOError):
            raise DaemonIsRunningError
        self.__pid_file=pid_file

    def __enter__(self):
        if not self.__do_detach():
            return None
        if self.__pid_fp is not None:
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

def daemonize(key_pidfile:str,key_detach:str):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(config,*args,**kwargs):
            pid_file=config.get(key_pidfile,None)
            detach=config.get(key_detach,False)
            with DaemonManager(pid_file,detach) as daemon:
                if daemon is None:
                    exit(0)
                func(config,*args,**kwargs)
        return wrapper
    return decorator

def stop_daemon(pid_file):
    pid=None
    if not os.path.exists(pid_file):
        raise DaemonNotRunningError
    with open(pid_file,'r') as f:
        try:
            fcntl.flock(f,fcntl.LOCK_EX|fcntl.LOCK_NB)
            raise DaemonAbnormalExitError
        except IOError as e:
            if e.errno not in (errno.EAGAIN, errno.EACCES):
                raise
            f.seek(0) 
            pid=int(f.read().strip())
    if pid is not None:
        os.kill(pid,signal.SIGINT)

