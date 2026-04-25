from util import Logger
from util import load_module

class MailCenter(Logger):
    def __init__(self,app,config):
        app['mailCenter']=self

