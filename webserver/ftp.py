import logging
import asyncio
import aioftp
import asyncssh
from pathlib import PurePosixPath
import io
import os
from typing import Union, List, AsyncIterable, Any
from util import Logger


class SFTPStat:
    def __init__(self,stat,fname):
        self.st_mtime=stat.mtime
        self.st_atime=stat.atime
        self.st_mode=stat.permissions
        self.st_nlink=1
        self.st_size=stat.size
        self.name=fname


class SFTPPathIO(aioftp.AbstractPathIO):
    def __init__(self,*,timeout=None,connection=None,state=None):
        self._conn = connection
        self._file = None

    @property
    def _sftp(self):
        return self._conn.user.sftp_client

    @property
    def _cwd(self):
        return self._conn.user.base_path

    async def exists(self, path) -> bool:
        logging.getLogger(self.__class__.__name__).error(f'exists {path}')
        full_path = str(path)
        try:
            await self._sftp.stat(full_path)
            return True
        except (FileNotFoundError, IOError):
            return False

    async def is_dir(self, path) -> bool:
        full_path = str(self._cwd/path)
        try:
            stat = await self._sftp.stat(full_path)
            return stat.type == asyncssh.sftp.FILEXFER_TYPE_DIRECTORY
        except (FileNotFoundError, IOError):
            return False

    async def is_file(self, path) -> bool:
        full_path = str(path)
        try:
            stat = await self._sftp.stat(full_path)
            return stat.type == asyncssh.sftp.FILEXFER_TYPE_REGULAR
        except (FileNotFoundError, IOError):
            return False

    async def list(self, path) -> AsyncIterable[Any]:
        full_path = str(self._cwd/path)
        logging.getLogger(self.__class__.__name__).error(f'list {path}')
        for attr in await self._sftp.listdir(full_path):
            logging.getLogger(self.__class__.__name__).error(f'list2 {attr}')
            yield PurePosixPath(attr)

    async def mkdir(self, path, *, parents: bool = False) -> None:
        full_path = str(path)
        if parents:
            await self._sftp.makedirs(full_path)
        else:
            await self._sftp.mkdir(full_path)

    async def rmdir(self, path) -> None:
        full_path = str(path)
        await self._sftp.rmdir(full_path)

    async def unlink(self, path) -> None:
        full_path = str(path)
        await self._sftp.unlink(full_path)

    async def rename(self, src, dst: Union[str, PurePosixPath]) -> None:
        full_src = str(src)
        full_dst = str(dst)
        await self._sftp.rename(full_src, full_dst)

    async def stat(self, path) -> Any:
        full_path = str(self._cwd/path)
        logging.getLogger(self.__class__.__name__).error(f'stat {full_path}')
        file_stat=await self._sftp.stat(full_path)
        logging.getLogger(self.__class__.__name__).error(file_stat)
        return SFTPStat(file_stat,os.path.basename(full_path))

    async def _open(self, path, mode: str = "rb") -> None:
        full_path = str(path)
        if self._file is not None:
            await self._file.close()
        # 根据模式打开文件（简化处理：写入时用 wb+，否则 rb）
        if "w" in mode or "a" in mode or "+" in mode:
            self._file = await self._sftp.open(full_path, "wb+")
        else:
            self._file = await self._sftp.open(full_path, "rb")

    async def read(self, size: int, _=None) -> bytes:
        if self._file is None:
            raise IOError("File not open")
        return await self._file.read(size)

    async def write(self, _, data: bytes) -> int:
        if self._file is None:
            raise IOError("File not open")
        return await self._file.write(data)

    async def seek(self, position: int,_=None) -> int:
        if self._file is None:
            raise IOError("File not open")
        return await self._file.seek(position)

    async def close(self,_=None) -> None:
        if self._file is not None:
            await self._file.close()
            self._file = None


class SFTPUserManager(aioftp.AbstractUserManager):
    def __init__(self, sftp_host: str, sftp_port: int):
        self.sftp_host = sftp_host
        self.sftp_port = sftp_port

    async def get_user(self, login: str) -> aioftp.User:
        stat=aioftp.AbstractUserManager.GetUserResponse.PASSWORD_REQUIRED
        user=aioftp.User(login=login, permissions=[
            aioftp.Permission("/",readable=True,writable=True)
        ])
        return stat,user,'Password Required'

    async def authenticate(self, user: aioftp.User, password: str) -> bool:
        try:
            conn = await asyncssh.connect(
                host=self.sftp_host,
                port=self.sftp_port,
                username=user.login,
                password=password,
                known_hosts=None
            )
            user.sftp_conn = conn
            user.sftp_client = await conn.start_sftp_client()
            base_path=await user.sftp_client.realpath('.')
            user.home_path='/'
            user.base_path=PurePosixPath(base_path)
            return True
        except asyncssh.misc.PermissionDenied:
            return False
        except Exception as e:
            logging.getLogger(self.__class__.__name__).error(e,exc_info=True)
            return False


class FTP2SFTPBridgeServer(aioftp.Server):
    def __init__(self, config):
        self._config=config['ftp']
        super().__init__(
            users=SFTPUserManager(
                sftp_host=self._config['sftp_host'],
                sftp_port=self._config.get('sftp_port',22)
            ),
            data_ports=range(self._config['pasv_port_start'],
                             self._config['pasv_port_end']+1),
            path_io_factory=SFTPPathIO,
            ipv4_pasv_forced_response_address=self._config.get('pasv_addr'),
            idle_timeout=300,
            maximum_connections=50,
            encoding="utf-8"
        )

    async def __aenter__(self):
        ftp_config=self._config
        await self.start(ftp_config.get('host','0.0.0.0'),
                         ftp_config.get('port',21))
        return self

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        await self.close()

