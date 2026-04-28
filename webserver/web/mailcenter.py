import hashlib
from util import Logger
from util import load_module

class MailCenterInstance(Logger):
    def __load_users(self,users):
        self._users=users
        self._user_login={}
        for item in users:
            if 'password' in item:
                self._user_login[item['username']]=item

    def __init__(self,config):
        self.__load_users(config['mail']['users'])

    async def auth(self,username,password):
        if not username or not password or username not in self._user_login:
            return False
        userdata=self._user_login[username]
        return userdata['password']==hashlib.sha256(password.encode('iso8859-1',errors='ignore')).hexdigest()

    async def start(self):
        pass

    async def stop(self):
        pass



def MailCenter(app):
    return app['mailCenter']


def setup(app):
    async def __mailcenter_start(app):
        await app['mailCenter'].start()

    async def __mailcenter_stop(app):
        await app['mailCenter'].stop()

    if 'mailCenter' not in app:
        app['mailCenter']=MailCenterInstance(app['config'])
        app.on_startup.append(__mailcenter_start)
        app.on_cleanup.append(__mailcenter_stop)
    return app['mailCenter']

