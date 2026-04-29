import hashlib
import aiosqlite
import time
import aiosqlite
from aiosqlitepool import SQLiteConnectionPool
from util import Logger
from util import load_module


async def sql_insert_single(conn,table,data:dict):
    columns=list(data.keys())
    cols_sql=','.join(columns)
    placeholders=','.join(['?'] * len(columns))
    values=tuple(data[col] for col in columns)
    sql=f'INSERT INTO {table} ({cols_sql}) VALUES ({placeholders})'
    return await conn.execute(sql,values)


class MailCenterInstance(Logger):
    _setup_script="""
CREATE TABLE IF NOT EXISTS email (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    from_uid INTEGER NOT NULL,
    sent_time INTEGER,
    create_time INTEGER NOT NULL,
    update_time INTEGER,
    status INTEGER NOT NULL,
    subject TEXT,
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

CREATE TABLE IF NOT EXISTS thread_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    current_id INTEGER NOT NULL DEFAULT 0
) STRICT;

INSERT OR IGNORE INTO thread_counter (id, current_id) VALUES (1, 0);
"""
    def _load_users(self,users):
        self._users={}
        self._user_login={}
        for item in users:
            self._users[item['uid']]=item
            if 'password' in item:
                self._user_login[item['username']]=item

    async def _create_conn(self)->aiosqlite.Connection:
        config_db=self._config['mail']['db']
        conn=await aiosqlite.connect(config_db['db_file'])
        conn.row_factory=aiosqlite.Row
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

    async def _next_thread_id(self,conn)->int:
        cursor = await conn.execute("UPDATE thread_counter SET current_id = current_id + 1 WHERE id = 1 RETURNING current_id")
        row = await cursor.fetchone()
        await conn.commit()
        return row[0]

    def __init__(self,config):
        self._config=config
        self._load_users(config['mail']['users'])
        self._pool=SQLiteConnectionPool(connection_factory=self._create_conn)

    async def auth(self,username,password):
        if not username or not password or username not in self._user_login:
            return None
        user=self._user_login[username]
        password_hash=hashlib.sha256(password.encode('iso8859-1',errors='ignore')).hexdigest()
        if user['password']!=password_hash:
            return None
        return user['uid']

    async def start(self):
        async with self._pool.connection() as conn:
            await conn.executescript(self._setup_script)
            await conn.commit()

    async def stop(self):
        await self._pool.close()

    async def _update_draft(self,email_id,uid,data):
        async with self._pool.connection() as conn:
            await conn.execute('UPDATE email SET \
                to_orig=?,cc_orig=?,subject=?,body=?,update_time=? \
                WHERE id=? AND from_uid=? and sent_time is NULL',
                (
                    data.get('to',''),
                    data.get('cc',''),
                    data.get('subject',''),
                    data.get('body',''),
                    int(time.time()),
                    email_id,
                    uid
                ))
            await conn.commit()

    async def _insert_draft(self,uid,data):
        email_id=None
        async with self._pool.connection() as conn:
            cursor=await sql_insert_single(conn,'email',{
                'thread_id':await self._next_thread_id(conn),
                'from_uid':uid,
                'create_time':int(time.time()),
                'status':0,
                'subject':data.get('subject',''),
                'body':data.get('body',''),
                'to_orig':data.get('to',''),
                'cc_orig':data.get('cc',''),
            })
            email_id=cursor.lastrowid
            await conn.commit()
        return email_id

    async def get_email_draft(self,uid,email_id):
        email=None
        async with self._pool.connection() as conn:
            cursor=await conn.execute('SELECT * FROM email where from_uid=? \
                AND id=? AND sent_time is NULL',(uid,email_id))
            email=await cursor.fetchone()
        return email

    async def save_draft(self,uid,data,email_id=None):
        if email_id is not None:
            await self._update_draft(email_id,uid,data)
        else:
            email_id=await self._insert_draft(uid,data)
        return email_id


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

