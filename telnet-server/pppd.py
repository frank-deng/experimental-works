#!/usr/bin/env python3

import os, subprocess, pty, fcntl, argparse;
from serverLib import SocketServer;

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
parser.add_argument('pppd_options', nargs=argparse.REMAINDER, help='Options for pppd');
args = parser.parse_args();

class PppdHandler:
    __closed=False;
    __process=None;
    def __init__(self,pppd_options):
        self.__master, self.__slave = pty.openpty();
        fcntl.fcntl(self.__master, fcntl.F_SETFL, fcntl.fcntl(self.__master, fcntl.F_GETFL) | os.O_NONBLOCK);
        ptyPath="/proc/"+str(os.getpid())+'/fd/'+str(self.__slave);
        self.__process=subprocess.Popen(['/usr/sbin/pppd', ptyPath]+pppd_options);

    def close(self):
        if self.__closed:
            return;
        if self.__process.poll() is None:
            self.__process.kill();
        os.close(self.__slave);
        os.close(self.__master);
        self.__closed=True;

    def read(self, data):
        if self.__process.poll() is not None:
            return None;
        os.write(self.__master, data);

    def write(self):
        if self.__process.poll() is not None:
            return None;
        try:
            return os.read(self.__master, 65536);
        except BlockingIOError:
            return b'';

if '__main__'==__name__:
    socketServer=SocketServer(args.host,args.port,PppdHandler,args.pppd_options);
    try:
        socketServer.run();
    except KeyboardInterrupt:
        pass;
    finally:
        socketServer.close();
    exit(0);
