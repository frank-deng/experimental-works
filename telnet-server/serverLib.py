import sys,time,socket,select;

def __defaultErrorHandler(self,e):
    sys.stderr.write(str(e)+"\n");

class SocketServer:
    __addr=('0,0,0,0',8080);
    __inputs=[];
    __outputs=[];
    __instances={};
    def __init__(self,host,port,handler,args=(),errorHandler=None):
        self.__addr=(host,port);
        self.__handler=handler;
        self.__handlerArgs=args;
        if errorHandler:
            self.__errorHandler=errorHandler;
        else:
            self.__errorHandler=__defaultErrorHandler;
    
    def __closeConnection(self,socket):
        try:
            fileno=str(socket.fileno());
            if socket in self.__inputs:
                self.__inputs.remove(socket);
            if socket in self.__outputs:
                self.__outputs.remove(socket);
            if fileno in self.__instances:
                self.__instances.pop(fileno).close();
            socket.close();
        except Exception as e:
            self.__error(e);

    def __error(self,e):
        try:
            self.__errorHandler(e);
        except Exception as e:
            pass;
    
    def close(self):
        for key, instance in self.__instances.items():
            try:
                instance.close();
            except Exception as e:
                pass;
    
    def run(self):
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM);
        server.setblocking(0);
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR,1);
        server.bind(self.__addr);
        server.listen(5);
        self.__inputs.append(server);
        while True:
            readable, writable, exceptional = select.select(self.__inputs,self.__outputs,self.__inputs);
            for s in readable:
                if s is server:
                    try:
                        conn, addr = s.accept();
                        conn.setblocking(0);
                        self.__inputs.append(conn);
                        self.__instances[str(conn.fileno())] = self.__handler(*self.__handlerArgs);
                    except Exception as e:
                        sys.stderr.write(str(e)+"\n");
                else:
                    try:
                        result=self.__instances[str(s.fileno())].write(s.recv(1024));
                        if None==result:
                            self.__closeConnection(s);
                        elif s not in self.__outputs:
                            self.__outputs.append(s);
                    except Exception as e:
                        self.__error(e);
                        self.__closeConnection(s);

            for s in writable:
                try:
                    content=self.__instances[str(s.fileno())].read();
                    if None==content:
                        self.__closeConnection(s);
                    else:
                        s.sendall(content);
                        if s in self.__outputs:
                            self.__outputs.remove(s);
                except Exception as e:
                    self.__error(e);
                    self.__closeConnection(s);

            for s in exceptional:
                self.__closeConnection(s);
            time.sleep(0);
