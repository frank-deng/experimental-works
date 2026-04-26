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

    def auth(self,username,password):
        if not username or not password or username not in self._user_login:
            return False
        userdata=self._user_login[username]
        return userdata['password']==hashlib.sha256(password.encode('iso8859-1',errors='ignore')).hexdigest()


def MailCenter(app):
    if 'mailCenter' not in app:
        app['mailCenter']=MailCenterInstance(app['config'])
    return app['mailCenter']

