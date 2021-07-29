from serverLib import SocketServer;
from queue import Full, Empty, Queue;

class LoginHandler:
    __running=True;
    __queue=Queue();
    __action='showLogin';
    __allowEcho=True;
    def __init__(self):
        pass;
    
    def read(self,content):
        if not self.__running:
            return None;
        try:
            self.__queue.put(content,False);
        except Full:
            pass;
        return True;

    def write(self):
        if not self.__running:
            return None;
        action=self.__action;
        if 'showLogin'==action:
            self.__action='inputUserName';
            return b'\r\nLogin:';
        elif 'inputUserName'==action:
            try:
                return self.__queue.get(False);
            except Empty:
                pass;
        return b'';

    def close(self):
        self.__running=False;

if '__main__'==__name__:
    socketServer=SocketServer('0.0.0.0',8086,LoginHandler);
    try:
        socketServer.run();
    except KeyboardInterrupt:
        pass;
    finally:
        socketServer.close();
    exit(0);
