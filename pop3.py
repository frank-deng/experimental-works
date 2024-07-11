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

msg2="""Received: from frank ( [60.215.174.212] ) by\r
erine ; Tue, 25 Jul 2024 22:09:28 +0800 (GMT+08:00)\r
Date: Mon, 14 May 2012 00:56:10 +0900\r
From: erine@ai.com\r
Subject: Test 2\r
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

class MailBox:
    def __init__(self,mailList):
        self.__mailList=mailList
    
    def close(self):
        self.__mailList[:]=[mail for mail in self.__mailList if not mail['delete']]

    def stat(self):
        totalSize=0
        for mail in self.__mailList:
            totalSize+=len(mail['msg'])
        return (len(self.__mailList), totalSize)

    def retrive(self,idx):
        if idx < 1 or idx > len(self.__mailList):
            return None
        idx-=1
        mail=self.__mailList[idx]
        return mail['msg']
        
    def delete(self,idx,flag=True):
        if idx < 1 or idx > len(self.__mailList):
            return False
        idx-=1
        mail=self.__mailList[idx]
        mail['delete']=flag
        return True

class MailCenter:
    def __init__(self):
        self.__data={
            'frank':{
                'mailList':[
                    {
                        'msg':msg.encode('iso8859-1'),
                        'delete':False
                    },
                    {
                        'msg':msg2.encode('iso8859-1'),
                        'delete':False
                    }
                ]
            }
        }

    def getMailBox(self,user,password):
        userInfo=self.__data.get(user,None)
        if userInfo is None:
           return None
        return MailBox(userInfo['mailList'])
        
mailCenter=MailCenter()

class POP3Service:
    __user=None
    __mailBox=None
    __running=True
    __noAuthCmd={'USER','PASS'}
    def __init__(self,reader,writer,timeout=60):
        self.__reader=reader
        self.__writer=writer
        self.__timeout=timeout
        self.__handlerDict={
            'USER':self.__handleUser,
            'PASS':self.__handlePass,
            'STAT':self.__handleStat,
            'RETR':self.__handleRetr,
            'DELE':self.__handleDel,
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
        self.__mailBox=None
        self.__writer.write(b'+OK\r\n')
    
    def __handlePass(self,line):
        global mailCenter
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing Password\r\n')
            return
        mailBox=mailCenter.getMailBox(self.__user,match[1])
        if mailBox is None:
            self.__writer.write(b'-ERR Auth Failed\r\n')
            return
        self.__mailBox=mailBox
        self.__writer.write(b'+OK\r\n')
        
    def __handleStat(self,line):
        mailCount, totalSize = self.__mailBox.stat()
        self.__writer.write(f"+OK {mailCount} {totalSize}\r\n".encode('iso8859-1'))

    def __handleRetr(self,line):
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing email num\r\n')
            return
        idx=int(match[1])
        msg=self.__mailBox.retrive(idx)
        if msg is None:
            self.__writer.write(b'-ERR Mail not found\r\n')
            return
        self.__writer.write(b'+OK\r\n')
        self.__writer.write(msg)
        
    def __handleDel(self,line):
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^[^\s]+\s+([^\s]+)',content)
        if match is None:
            self.__writer.write(b'-ERR Missing email num\r\n')
            return
        idx=int(match[1])
        if self.__mailBox.delete(idx):
            self.__writer.write(b'+OK\r\n')
        else:
            self.__writer.write(b'-ERR Failed to delete mail\r\n')
    
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
            elif (cmd not in self.__noAuthCmd) and (self.__mailBox is None):
                self.__writer.write(b'-ERR Not Authorized\r\n')
            else:
                handler(line)
            await self.__writer.drain()
        self.__mailBox.close()

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
    for s in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(s, lambda: server.close())
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