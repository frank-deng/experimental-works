import asyncio,signal,json,hashlib,os,re,threading,importlib,platform
from uuid import uuid4 as uuidgen
from traceback import print_exc

class MailUserNormal:
    def __init__(self,userName,params):
        self.__user=userName
        self.__mailList=[]
        self.__hosts=set(params['hosts'])
        self.__lock=asyncio.Lock()

    async def getAll(self):
        res=[]
        async with self.__lock:
            res=self.__mailList[:]
        return res

    async def delete(self,delSet):
        async with self.__lock:
            self.__mailList[:]=[mail for mail in self.__mailList if mail['id'] not in delSet]

    async def append(self,userFrom,msg):
        async with self.__lock:
            self.__mailList.append({
                'id':str(uuidgen()),
                'from':userFrom,
                'msg':msg
            })

    def checkHosts(self, hostIn):
        return hostIn in self.__hosts


class MailUserRobot:
    __task=None
    def __init__(self,userName,params,sendQueue):
        self.__user=userName
        self.__recvQueue=asyncio.Queue()
        self.__module=importlib.import_module(params['module'])
        self.__task=asyncio.create_task(self.__module.run(self.__user,params,self.__recvQueue,sendQueue))

    async def append(self,userFrom,msg):
        self.__recvQueue.put_nowait({
            'id':str(uuidgen()),
            'from':userFrom,
            'msg':msg,
        })

    def close(self):
        if self.__task is not None:
            self.__task.cancel()


class MailCenter:
    __task=None
    def __init__(self):
        self.__user={}
        self.__password={}
        self.__sendQueue=asyncio.Queue()
        
    async def __sendQueueTask(self):
        while True:
            mail=await self.__sendQueue.get()
            target=mail.get('to',None)
            if (target is None) or (target not in self.__user):
                continue
            await self.__user[target].append(mail.get('from','unknown'), mail['msg'])

    async def load(self, configFile):
        with open(configFile, 'r') as f:
            jsonData=json.load(f)
            for userName in jsonData:
                userDetail=jsonData[userName]
                if 'password' in userDetail:
                    self.__user[userName]=MailUserNormal(userName,userDetail.copy())
                    self.__password[userName]=userDetail['password']
                elif 'module' in userDetail:
                    self.__user[userName]=MailUserRobot(userName,userDetail.copy(),self.__sendQueue)
            self.__task=asyncio.create_task(self.__sendQueueTask())
            await asyncio.sleep(0)

    def getUser(self,user,passwordIn):
        password=self.__password.get(user,None)
        if password is None:
           return None
        passwordInHash=hashlib.sha256(passwordIn.encode('iso8859-1')).hexdigest()
        if password != passwordInHash:
           return None
        return self.__user[user]
    
    def checkAddr(self,addr,isSender=False):
        match=re.search(r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)$',addr)
        if match is None:
            return None
        user,host = match[1],match[2]
        userObj = self.__user.get(addr, self.__user.get(user, None))
        if userObj is None:
            return None
        elif isinstance(userObj, MailUserNormal) and not userObj.checkHosts(host):
            return None
        elif isinstance(userObj, MailUserNormal):
            return user
        else:
            return addr
    
    async def sendTo(self,userFrom,userTo,msg):
        if userTo not in self.__user:
            return False
        await self.__user[userTo].append(userFrom,msg)

    def close(self):
        for user in self.__user.values():
            if isinstance(user,MailUserRobot):
                user.close()
        if self.__task is not None:
            self.__task.cancel()
