#!/usr/bin/env python3

import asyncio,signal,json,hashlib,os,re
from traceback import print_exc

class MailBox:
    def __init__(self,username,mailList):
        self.__user=username
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
    __acceptedHosts={'10.0.2.2'}
    def __init__(self):
       self.__data={
            'frank':{
                'role':'user',
                'mailList':[]
            },
            'niwenwoda':{
                'role':'robot',
                'mailList':[]
            }
        }

    def getMailBox(self,user,password):
        userInfo=self.__data.get(user,None)
        if userInfo is None:
           return None
        return MailBox(user,userInfo['mailList'])
    
    def checkAddr(self,addr,isSender=False):
        match=re.search(r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)$',addr)
        if match is None:
            return None
        user,host = match[1],match[2]
        if (host not in self.__acceptedHosts) or (user not in self.__data):
            return None
        userData=self.__data[user]
        if isSender and userData['role'] != 'user':
            return None
        else:
            return user
    
    def sendTo(self,userFrom,userTo,msg):
        if userTo not in self.__data:
            return False
        self.__data[userTo]['mailList'].append({
            'msg':msg,
            'from':userFrom,
            'delete':False,
        })
        return True
        
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
        if re.search(rb'\r\n$',msg) is None:
            msg+=b'\r\n'
        msg+=b'.\r\n'
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

class SMTPService:
    __running=True
    __mailFrom=None
    def __init__(self,reader,writer,timeout=60):
        self.__reader=reader
        self.__writer=writer
        self.__timeout=timeout
        self.__rcpt=set()
        self.__handlerDict={
            'HELO':self.__handleGreeting,
            'MAIL':self.__handleSrc,
            'RCPT':self.__handleRcpt,
            'DATA':self.__handleData,
            'NOOP':self.__handleNoop,
            'QUIT':self.__handleQuit,
        }

    async def __handleGreeting(self,line):
        self.__writer.write(b'250 OK\r\n')
        await self.__writer.drain()

    async def __handleSrc(self,line):
        global mailCenter
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^MAIL From:\s*<([^<>\s]+)>',content,re.IGNORECASE)
        if match is None:
            self.__writer.write(b'501 Invalid Parameter\r\n')
            await self.__writer.drain()
            return
        user=mailCenter.checkAddr(match[1],True)
        if user is None:
            self.__writer.write(b'510 Invalid email address\r\n')
            await self.__writer.drain()
            return
        self.__mailFrom=user
        self.__writer.write(b'250 OK\r\n')
        await self.__writer.drain()

    async def __handleRcpt(self,line):
        content=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^RCPT To:\s*<([^<>\s]+)>',content,re.IGNORECASE)
        if match is None:
            self.__writer.write(b'501 Invalid Parameter\r\n')
            await self.__writer.drain()
            return
        user=mailCenter.checkAddr(match[1],True)
        if user is None:
            self.__writer.write(b'510 Invalid email address\r\n')
            await self.__writer.drain()
            return
        self.__rcpt.add(user)
        self.__writer.write(b'250 OK\r\n')
        await self.__writer.drain()
        
    async def __handleNoop(self,line):
        self.__writer.write(b'250 OK\r\n')
        await self.__writer.drain()

    async def __handleQuit(self,line):
        self.__running=False
        self.__writer.write(b'250 OK\r\n')
        await self.__writer.drain()
        
    async def __handleData(self,line):
        self.__writer.write(b'354 End data with <CR><LF>.<CR><LF>\r\n')
        await self.__writer.drain()
        msg=b''
        while msg.find(b'\r\n.\r\n')<0:
            msg+=await asyncio.wait_for(self.__reader.read(512), timeout=self.__timeout)
        msg=msg[:msg.find(b'\r\n.\r\n')]
        self.__writer.write(b'250 Mail OK\r\n')
        await self.__writer.drain()
        for user in self.__rcpt:
            mailCenter.sendTo(self.__mailFrom, user, msg);

    def __getCmd(self,line):
        if line==b'':
            return None
        cmd=line.decode('iso8859-1','ignore').strip()
        match=re.search(r'^([^\s]+)',cmd)
        if match is None:
            return ''
        return match[1]
    
    async def run(self):
        self.__writer.write(b'220 mysite.net\r\n')
        while self.__running:
            line=await asyncio.wait_for(self.__reader.readuntil(b'\n'), timeout=self.__timeout)
            cmd=self.__getCmd(line)
            if cmd is None:
                break
            handler=self.__handlerDict.get(cmd,None)
            if handler is None:
                self.__writer.write(b'502 Unimplemented Command\r\n')
                continue
            try:
                await handler(line)
            except Exception:
                print_exc()
                self.__writer.write(b'550 Internal Error\r\n')
                await self.__writer.drain()

async def service_handler_pop3(reader,writer):
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

async def service_handler_smtp(reader,writer):
    try:
        srv=SMTPService(reader,writer)
        await srv.run()
    except (asyncio.TimeoutError, ConnectionResetError, BrokenPipeError):
        pass
    except Exception as e:
        print_exc()
    finally:
        if not writer.is_closing():
            writer.close()
            await writer.wait_closed()

async def main(args):
    server_pop3=await asyncio.start_server(service_handler_pop3,host=args.host,port=args.port_pop3)
    server_smtp=await asyncio.start_server(service_handler_smtp,host=args.host,port=args.port_smtp)
    loop = asyncio.get_event_loop()
    for s in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(s, lambda: server_pop3.close())
        loop.add_signal_handler(s, lambda: server_smtp.close())
    try:
        async with server_pop3:
            async with server_smtp:
                await asyncio.gather(server_pop3.serve_forever(), server_smtp.serve_forever())
    except asyncio.exceptions.CancelledError:
        pass
    finally:
        await asyncio.gather(server_pop3.wait_closed(), server_smtp.wait_closed())

if '__main__'==__name__:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--host',
        help='Specify binding host for the PPP server.',
        default=''
    )
    parser.add_argument(
        '--port_pop3',
        help='Specify port for the PPP server.',
        type=int,
        default=110
    )
    parser.add_argument(
        '--port_smtp',
        help='Specify port for the PPP server.',
        type=int,
        default=25
    )
    args = parser.parse_args();
    asyncio.run(main(args))