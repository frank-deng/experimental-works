#!/usr/bin/env python3
import sysinfo;
import time, json, sys, threading;
from wsgiref.simple_server import make_server
from ws4py.websocket import WebSocket
from ws4py.server.wsgirefserver import WSGIServer, WebSocketWSGIRequestHandler
from ws4py.server.wsgiutils import WebSocketWSGIApplication

HOST = '';
PORT = 2000;
INTERVAL = 1;

class SysInfoWebSocketManager(threading.Thread):
    __sysInfo = sysinfo.SysInfo();
    __networkStatLast = None;
    __mutex = threading.Lock();
    __instances = {};
    __active = True;
    def __init__(self, interval = 1):
        threading.Thread.__init__(self);
        self.__interval = interval;
        self.start();

    def insert(self, uuid, ws):
        self.__mutex.acquire();
        self.__instances[uuid] = ws;
        self.__mutex.release();

    def delete(self, uuid):
        self.__mutex.acquire();
        if (self.__instances.get(uuid)):
            del self.__instances[uuid];
        self.__mutex.release();

    def shutdown(self):
        self.__mutex.acquire();
        self.__active = False;
        self.__instances.clear();
        self.__mutex.release();
        self.join();

    def run(self):
        try:
            isActive = True;
            while isActive:
                timestamp = time.time();
                result = self.__sysInfo.fetch();
                jsonInfo = {};
                if 'cpu_temp' in result:
                    jsonInfo['cpu_temp'] = result['cpu_temp'];
                if 'gpu_temp' in result:
                    jsonInfo['gpu_temp'] = result['gpu_temp'];
                if 'cpu_usage' in result:
                    jsonInfo['cpu_usage'] = result['cpu_usage']['overall'];
                    jsonInfo['per_cpu_usage'] = result['cpu_usage']['each'];
                if 'mem_usage' in result:
                    jsonInfo['mem_usage'] = result['mem_usage'];
                if 'boot_time' in result:
                    jsonInfo['boot_time'] = result['boot_time'].strftime('%Y-%m-%dT%H:%M:%S');
                if 'battery_level' in result:
                    jsonInfo['battery_level'] = result['battery_level'];
                if 'network_stat' in result:
                    del result['network_stat']['lo'];
                    if self.__networkStatLast != None:
                        jsonInfo['network_stat'] = {};
                        for dev in sorted(result['network_stat'].keys()):
                            jsonInfo['network_stat'][dev] = {};
                            rx_now = result['network_stat'][dev]['rx_bytes'];
                            rx_last = self.__networkStatLast[dev]['rx_bytes'];
                            jsonInfo['network_stat'][dev]['rx_speed'] = (rx_now - rx_last / self.__interval);
                            tx_now = result['network_stat'][dev]['tx_bytes'];
                            tx_last = self.__networkStatLast[dev]['tx_bytes'];
                            jsonInfo['network_stat'][dev]['tx_speed'] = (tx_now - tx_last / self.__interval);
                    else:
                        jsonInfo['network_stat'] = {};
                        for dev in sorted(result['network_stat'].keys()):
                            jsonInfo['network_stat'][dev] = {'rx_speed':-1, 'tx_speed':-1};
                    self.__networkStatLast = result['network_stat'];

                self.__mutex.acquire();
                isActive = self.__active;
                try:
                    for _uuid in self.__instances:
                        self.__instances[_uuid].send(json.dumps(jsonInfo));
                finally:
                    self.__mutex.release();

                timedelta = time.time() - timestamp;
                time.sleep(self.__interval - timedelta);
        except BrokenPipeError:
            pass;

if __name__ == '__main__':
    try:
        PORT = int(sys.argv[1]);
    except (IndexError, ValueError):
        pass;
    try:
        INTERVAL = float(sys.argv[2]);
    except (IndexError, ValueError):
        pass;

    sysInfoWebSocketManager = SysInfoWebSocketManager(INTERVAL);
    class SysInfoWebSocket(WebSocket):
        def opened(self):
            connid = str(self.peer_address[0])+':'+str(self.peer_address[1]);
            sysInfoWebSocketManager.insert(connid, self);

        def closed(self, code, reason=None):
            connid = str(self.peer_address[0])+':'+str(self.peer_address[1]);
            sysInfoWebSocketManager.delete(connid);

    droid = None;
    try:
        import android;
        droid = android.Android();
        droid.wakeLockAcquirePartial();
        droid.wifiLockAcquireFull();
    except ImportError:
        pass;

    try:
        server = make_server(HOST, PORT, server_class=WSGIServer,
            handler_class=WebSocketWSGIRequestHandler,
            app=WebSocketWSGIApplication(handler_cls=SysInfoWebSocket));
        server.initialize_websockets_manager();
        server.serve_forever();
    except KeyboardInterrupt:
        pass;
    finally:
        print('Shutting down server, please wait...');
        sysInfoWebSocketManager.shutdown();
        server.shutdown();
        if (droid != None):
            droid.wifiLockRelease();
            droid.wakeLockRelease();
    exit(0);

