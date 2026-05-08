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


async def sql_insert_multi(conn,table,data:list):
    columns=list(data[0].keys())
    cols_sql=','.join(columns)
    placeholders=','.join(['?'] * len(columns))
    values=[tuple(item[col] for col in columns) for item in data]
    sql=f'INSERT INTO {table} ({cols_sql}) VALUES ({placeholders})'
    return await conn.executemany(sql,values)


class MailCenterInstance(Logger):
    _setup_script="""
CREATE TABLE IF NOT EXISTS email (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_id INTEGER NOT NULL,
    frag_id INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS email_frag (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_uid INTEGER NOT NULL,
    sent_time INTEGER,
    subject TEXT,
    body TEXT,
    status INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS recipient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_id INTEGER NOT NULL,
    uid INTEGER NOT NULL,
    type INTEGER NOT NULL,
    status INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS email_id_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    current_id INTEGER NOT NULL DEFAULT 0
) STRICT;

INSERT OR IGNORE INTO email_id_counter (id, current_id) VALUES (1, 0);
"""
    def __init__(self,config):
        self._config=config
        self.pagesize=config['mail'].get('pagesize',30)
        self._host=config['mail']['host']
        self._load_users(config['mail']['users'])
        self._pool=SQLiteConnectionPool(connection_factory=self._create_conn)

    def _load_users(self,users):
        self._users={}
        self._users_by_name={}
        self._user_login={}
        for item in users:
            self._users[item['uid']]=item
            self._users_by_name[item['username']]=item
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

    async def _next_email_id(self,conn)->int:
        await conn.commit()
        return row[0]

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

    async def get_uid_from_addr(self,addr):
        items=addr.strip().split('@')
        if len(items)!=2:
            return None
        user,host=items[0],items[1]
        if host!=self._host or user not in self._users_by_name:
            return None
        return self._users_by_name[user]['uid']

    async def send(self,from_uid,to_list,cc_list,subject,body,
                   prev_email_id=None):
        async with self._pool.connection() as conn:
            email_list=[]
            if prev_email_id:
                cursor=await conn.execute("SELECT frag_id from email WHERE email_id=?",(prev_email_id,))
                email_list+=(await cursor.fetchall()).values()
            cursor=await conn.execute("UPDATE email_id_counter SET current_id = current_id + 1 WHERE id = 1 RETURNING current_id")
            email_id = (await cursor.fetchone())[0]
            frag_id=(await sql_insert_single(conn,'email_frag',{
                'from_uid':from_uid,
                'sent_time':int(time.time()),
                'subject':subject,
                'body':body,
                'status':0,
            })).lastrowid
            email_list.append(frag_id)
            await conn.executemany(
                'INSERT INTO email (email_id,frag_id) VALUES (?,?)',
                [(email_id,frag_id) for frag_id in email_list])
            await sql_insert_multi(conn,'recipient',[{
                'email_id':email_id,
                'uid':uid,
                'type':0,
                'status':0,
            } for uid in to_list]+[{
                'email_id':email_id,
                'uid':uid,
                'type':1,
                'status':0,
            } for uid in cc_list])
            await conn.commit()


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

