#!/usr/bin/env python3

import asyncio,signal,json,hashlib,subprocess,os,time,re
from traceback import print_exc

msg="""Received: from aldkfmwakd ( [60.215.174.212] ) by\r
aldwkcoaiwdfoaiwdjfoiaw ; Tue, 25 Jul 2023 22:09:28 +0800 (GMT+08:00)\r
Date: Mon, 14 May 2012 00:56:10 +0900\r
From: erine@ai.com\r
Subject: Test\r
Content-Transfer-Encoding: Quoted-Printable\r
Content-Disposition: inline\r
Mime-Version: 1.0\r
X-Priority: 3\r
To: frank@10.0.2.2\r
Content-Type: text/plain; charset="iso-8859-1"\r
\r
=B9=FE=B9=FE=B9=FE
\r
\r
.\r
"""

mailList=[
    {
        'msg':msg.encode('iso8859-1'),
        'delete':False
    }
]
    
class POP3Service:
    __user=None
    __authPass=False
    __running=True
    __authCmd={'STAT','LIST','RETR','DELE','REST','NOOP'}
    def __init__(self,reader,writer,timeout=60):
        self.__reader=reader
        self.__writer=writer
        self.__timeout=timeout
        self.__handlerDict={
            'USER':self.__handleUser,
            'PASS':self.__handlePass,
            'STAT':self.__handleStat,
            'LIST':self.__handleList,
            'RETR':self.__handleRetr,
            'DELE':self.__handleDel,
            'REST':self.__handleRest,
            'NOOP':self.__handleNoop,
            'QUIT':self.__handleQuit,
        }
        
    def __handleUser(self,line):
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing Username\r\n')
            return
        self.__user=match[1]
        self.__writer.write(b'+OK\r\n')
    
    def __handlePass(self,line):
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing Password\r\n')
            return
        self.__authPass=True
        self.__writer.write(b'+OK\r\n')
        
    def __handleStat(self,line):
        global mailList
        totalSize=0
        for mail in mailList:
            totalSize+=len(mail['msg'])
        self.__writer.write(f"+OK {len(mailList)} {totalSize}\r\n".encode('iso8859-1'))

    def __handleList(self,line):
        global mailList
        for mail in mailList:
            totalSize+=len(mail['msg'])
        self.__writer.write(f"+OK {len(mailList)} messages {totalSize}\r\n".encode('iso8859-1','ignore'))
        for idx in range(len(mailList)):
            msg=mailList[idx]['msg']
            self.__writer.write(f"{idx+1} {len(msg)}\r\n".encode('iso8859-1'))
    
    def __handleRetr(self,line):
        global mailList
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing email num\r\n')
            return
        idx=int(match[1])-1
        msg=mailList[idx]['msg']
        self.__writer.write(b'+OK\r\n')
        self.__writer.write(msg)
        
    def __handleDel(self,line):
        global mailList
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing email num\r\n')
            return
        idx=int(match[1])-1
        mailList[idx]['delete']=True
        self.__writer.write(b'+OK\r\n')

    def __handleRest(self,line):
        global mailList
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing email num\r\n')
            return
        idx=int(match[1])-1
        mailList[idx]['delete']=False
        self.__writer.write(b'+OK\r\n')
    
    def __handleNoop(self,line):
        self.__writer.write(b'+OK\r\n')

    def __handleQuit(self,line):
        self.__running=False
        self.__writer.write(b'+OK\r\n')
        
    def __getCmd(self,line):
        if line==b'':
            return None
        cmd=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^([^\s]+)',cmd)
        if match is None:
            return ''
        return match[1]
    
    async def run(self):
        self.__writer.write(b'+OK\r\n')
        while self.__running:
            line=await asyncio.wait_for(self.__reader.readuntil(b'\n'), timeout=self.__timeout)
            cmd=self.__getCmd(line)
            if cmd is None:
                break
            handler=self.__handlerDict.get(cmd,None)
            if handler is None:
                self.__writer.write(b'-ERR Invalid Command\r\n')
            elif (cmd in self.__authCmd) and (not self.__authPass):
                self.__writer.write(b'-ERR Not Authorized\r\n')
            else:
                handler(line)
            await self.__writer.drain()

async def service_handler(reader,writer):
    try:
        srv=POP3Service(reader,writer)
        await srv.run()
    except (asyncio.TimeoutError, ConnectionResetError, BrokenPipeError):
        pass
    except Exception as e:
        print_exc()
    finally:
        if not writer.is_closing():
            writer.close()
            await writer.wait_closed()

async def main(host,port):
    server=await asyncio.start_server(service_handler,host=host,port=port)
    loop = asyncio.get_event_loop()
#    for s in (signal.SIGINT, signal.SIGTERM):
#        loop.add_signal_handler(s, lambda: server.close())
    try:
        async with server:
            await server.serve_forever()
    except asyncio.exceptions.CancelledError:
        pass
    finally:
        await server.wait_closed()

if '__main__'==__name__:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--host',
        '-H',
        help='Specify binding host for the PPP server.',
        default=''
    )
    parser.add_argument(
        '--port',
        '-P',
        help='Specify port for the PPP server.',
        type=int,
        default=110
    )
    args = parser.parse_args();
    asyncio.run(main(args.host,args.port))