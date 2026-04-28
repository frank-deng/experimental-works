import hashlib
import aiosqlite
from aiosqlitepool import SQLiteConnectionPool
from util import Logger
from util import load_module

class MailCenterInstance(Logger):
    _setup_script="""
CREATE TABLE IF NOT EXISTS email (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    from_uid INTEGER NOT NULL,
    sent_time INTEGER,
    create_time INTEGER NOT NULL,
    update_time INTEGER,
    title TEXT,
    body TEXT,
    to_orig TEXT,
    cc_orig TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS recipient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_id INTEGER NOT NULL,
    uid INTEGER NOT NULL,
    type INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS maillist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    email_id INTEGER NOT NULL,
    status INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS attachment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_id INTEGER NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    file_name TEXT NOT NULL,
    file_id TEXT NOT NULL
) STRICT;
"""
    async def _create_conn(self)->aiosqlite.Connection:
        config_db=self._config['mail']['db']
        conn=await aiosqlite.connect(config_db['db_file'])
        busy_timeout=config_db.get('busy_timeout',5000)
        if not isinstance(busy_timeout,int):
            raise ValueError('busy_timeout must be int')
        cache_size=config_db.get('cache_size',8000)
        if not isinstance(cache_size,int):
            raise ValueError('cache_size must be int')
        await conn.execute("PRAGMA journal_mode=WAL;")
        await conn.execute(f"PRAGMA busy_timeout={busy_timeout};")
        await conn.execute(f"PRAGMA cache_size={cache_size};")
        await conn.execute("PRAGMA foreign_keys=ON;")
        await conn.execute("PRAGMA synchronous=NORMAL;")
        return conn

    def _load_users(self,users):
        self._users=users
        self._user_login={}
        for item in users:
            if 'password' in item:
                self._user_login[item['username']]=item

    def __init__(self,config):
        self._config=config
        self._load_users(config['mail']['users'])
        self._pool=SQLiteConnectionPool(connection_factory=self._create_conn)

    async def auth(self,username,password):
        if not username or not password or username not in self._user_login:
            return False
        userdata=self._user_login[username]
        return userdata['password']==hashlib.sha256(password.encode('iso8859-1',errors='ignore')).hexdigest()

    async def start(self):
        async with self._pool.connection() as conn:
            await conn.executescript(self._setup_script)
            await conn.commit()

    async def stop(self):
        await self._pool.close()


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

