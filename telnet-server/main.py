from queue import Full, Empty, Queue;
from serverLib import SocketServer;

class LoginHandler:
    __running=True;
    __queue=Queue();
    __action='showLogin';
    __inputContent=b'';
    __username=b'';
    __password=b'';
    __app=None;
    def __init__(self):
        pass;
    
    def read(self,content):
        if not self.__running:
            return None;
        action=self.__action;
        if 'inputUserName'==action:
            self.__inputContent+=content;
            try:
                self.__queue.put(content.replace(b'\r',b'').replace(b'\n',b''),False);
            except Full:
                pass;
            print(self.__inputContent);
            if -1!=self.__inputContent.find(b'\r'):
                self.__username=self.__inputContent;
                self.__inputContent=b'';
                self.__action='showPassword';
        elif 'inputPassword'==action:
            self.__inputContent+=content;
            if -1!=self.__inputContent.find(b'\r'):
                self.__password=self.__inputContent;
                self.__inputContent=b'';
                self.__action='processLogin';
        return True;

    def write(self):
        if not self.__running:
            return None;
        action=self.__action;
        output=b'';
        if 'showLogin'==action:
            self.__action='inputUserName';
            self.__queue.queue.clear();
            output+=b'\r\nLogin:';
        elif 'showPassword'==action:
            self.__action='inputPassword';
            self.__queue.queue.clear();
            output+=b'\r\nPassword:';
        elif 'processLogin'==action:
            self.__queue.queue.clear();
            self.__action='showLogin';
            output+=b'\r\n  u:'+self.__username+b'\r\n  p:'+self.__password;
        else:
            try:
                output+=self.__queue.get(False);
            except Empty:
                pass;
        return output;

    def close(self):
        self.__running=False;

if '__main__'==__name__:
    import argparse;
    parser = argparse.ArgumentParser();
    parser.add_argument(
        '--host',
        '-H',
        help='Specify binding host for the PPP server.',
        default=''
    );
    parser.add_argument(
        '--port',
        '-P',
        help='Specify port for the PPP server.',
        type=int,
        default=23
    );
    parser.add_argument('pppd_options', nargs=argparse.REMAINDER, help='Options for telnet-server');
    args = parser.parse_args();

    socketServer=SocketServer(args.host,args.port,LoginHandler);
    try:
        socketServer.run();
    except KeyboardInterrupt:
        pass;
    finally:
        socketServer.close();
    exit(0);
