import logging
import asyncio
import aioftp
import asyncssh
from pathlib import PurePosixPath
import io
from typing import Union, List, AsyncIterable, Any
from util import Logger

# --- 1. 核心：SFTP 文件操作适配器 ---
class SFTPPathIO(aioftp.AbstractPathIO):
    def __init__(self, sftp_client, current_dir: PurePosixPath):
        self._sftp = sftp_client
        logging.getLogger(self.__class__.__name__).error(str(current_dir))
        self._cwd = current_dir
        self._file = None

    async def exists(self, path: Union[str, PurePosixPath]) -> bool:
        full_path = str(self._cwd / path)
        try:
            await self._sftp.stat(full_path)
            return True
        except (FileNotFoundError, IOError):
            return False

    async def is_dir(self, path: Union[str, PurePosixPath]) -> bool:
        full_path = str(self._cwd / path)
        try:
            stat = await self._sftp.stat(full_path)
            return stat.type == asyncssh.SFTP_FILE_TYPE_DIRECTORY
        except (FileNotFoundError, IOError):
            return False

    async def is_file(self, path: Union[str, PurePosixPath]) -> bool:
        full_path = str(self._cwd / path)
        try:
            stat = await self._sftp.stat(full_path)
            return stat.type == asyncssh.SFTP_FILE_TYPE_REGULAR
        except (FileNotFoundError, IOError):
            return False

    async def list(self, path: Union[str, PurePosixPath]) -> AsyncIterable[Any]:
        full_path = str(self._cwd / path)
        logging.getLogger('aaa').error(f'path {full_path}')
        for attr in await self._sftp.listdir(full_path):
            logging.getLogger('aaa').error(f'attr {attr}')
            yield attr

    async def mkdir(self, path: Union[str, PurePosixPath], *, parents: bool = False) -> None:
        full_path = str(self._cwd / path)
        if parents:
            await self._sftp.makedirs(full_path)
        else:
            await self._sftp.mkdir(full_path)

    async def rmdir(self, path: Union[str, PurePosixPath]) -> None:
        full_path = str(self._cwd / path)
        await self._sftp.rmdir(full_path)

    async def unlink(self, path: Union[str, PurePosixPath]) -> None:
        full_path = str(self._cwd / path)
        await self._sftp.unlink(full_path)

    async def rename(self, src: Union[str, PurePosixPath], dst: Union[str, PurePosixPath]) -> None:
        full_src = str(self._cwd / src)
        full_dst = str(self._cwd / dst)
        await self._sftp.rename(full_src, full_dst)

    async def stat(self, path: Union[str, PurePosixPath]) -> Any:
        full_path = str(self._cwd / path)
        return await self._sftp.stat(full_path)

    async def _open(self, path: Union[str, PurePosixPath], mode: str = "rb") -> None:
        """
        打开一个文件，后续的 read/write/seek/close 都基于这个对象。
        """
        full_path = str(self._cwd / path)
        if self._file is not None:
            await self._file.close()
        # 根据模式打开文件（简化处理：写入时用 wb+，否则 rb）
        if "w" in mode or "a" in mode or "+" in mode:
            self._file = await self._sftp.open(full_path, "wb+")
        else:
            self._file = await self._sftp.open(full_path, "rb")

    async def read(self, size: int = -1) -> bytes:
        if self._file is None:
            raise IOError("File not open")
        return await self._file.read(size)

    async def write(self, data: bytes) -> int:
        if self._file is None:
            raise IOError("File not open")
        return await self._file.write(data)

    async def seek(self, position: int) -> int:
        if self._file is None:
            raise IOError("File not open")
        return await self._file.seek(position)

    async def close(self) -> None:
        if self._file is not None:
            await self._file.close()
            self._file = None


class SFTPUserManager(aioftp.AbstractUserManager):
    def __init__(self, sftp_host: str, sftp_port: int):
        self.sftp_host = sftp_host
        self.sftp_port = sftp_port

    async def get_user(self, login: str) -> aioftp.User:
        stat=aioftp.AbstractUserManager.GetUserResponse.PASSWORD_REQUIRED
        return stat,aioftp.User(login=login),'Password Required'

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
            user.sftp_root = PurePosixPath(await user.sftp_client.realpath('.'))
            logging.getLogger('aaa').error(user.sftp_root)
            return True
        except Exception as e:
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

    def path_io_factory(timeout=None, connection=None, state=None):
        user=connection.user
        return SFTPPathIO(user.sftp_client, user.sftp_root)

