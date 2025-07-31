#!/usr/bin/env python3

import logging
import sys
import tomllib
import importlib
import asyncio
import signal
from util import Logger


class ServerManager(Logger):
    def __init__(self,config):
        self.__conf=config
        self.__servers=[]
        for server_key in config.get('server',{}):
            server_conf=config['server'][server_key]
            server_instance=self.__server_init(server_conf,server_key)
            if server_instance is None:
                continue
            self.__servers.append(server_instance)

    def __server_init(self,config,server_key):
        server_instance=None
        try:
            if not config.get('enabled',True):
                return None
            if 'module' not in config:
                raise ValueError('Missing module')
            module_path=config['module']
            selector=None
            if ':' in module_path:
                module_path,selector=module_path.split(':')
            module=importlib.import_module(module_path)
            if selector is not None:
                module=getattr(module,selector)
            server_instance=module(config)
        except Exception as e:
            self.logger.error(f'Failed to load server {server_key}: {e}',
                              exc_info=True)
        return server_instance

    async def __aenter__(self):
        tasks=await asyncio.gather(*[self.__server_aenter(s) for s in self.__servers])
        for i in range(len(tasks)-1,-1,-1):
            _,e=tasks[i]
            if e is not None:
                del self.__servers[i]
        return self

    async def __server_aenter(self,server):
        try:
            res=await server.__aenter__()
            return res,None
        except Exception as e:
            self.logger.error(e,exc_info=True)
            return None,e

    async def __aexit__(self,exc_type,exc_val,exc_tb):
        for server in self.__servers:
            try:
                await server.__aexit__(exc_type,exc_val,exc_tb)
            except Exception as e:
                self.logger.error(e,exc_info=True)

    def close():
        for server in self.__servers:
            server.close()


async def main(config):
    try:
        async with ServerManager(config) as server_manager:
            loop = asyncio.get_event_loop()
            for s in (signal.SIGINT,signal.SIGTERM,signal.SIGQUIT):
                loop.add_signal_handler(s,server_manager.close)
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)

if '__main__'==__name__:
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument(
        '--config',
        '-c',
        help='Specify TOML config file.',
        default='server.toml'
    )
    args=parser.parse_args();
    config=None
    with open(args.config, 'rb') as f:
        try:
            config=tomllib.load(f)
        except tomllib.TOMLDecodeError as e:
            print(f'Failed to load {args.config}: {e}',file=sys.stderr)
            exit(1)
    logging.basicConfig(
        filename=config.get('log_file','server.log'),
        level=getattr(logging,config.get('log_level','INFO'),logging.INFO)
    )
    try:
        asyncio.run(main(config))
    except KeyboardInterrupt:
        pass
    except Exception as e:
        logging.getLogger(main.__name__).critical(e,exc_info=True)

