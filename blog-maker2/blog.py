#!/usr/bin/env python3

import sys
import os
import click
import tomllib
from util import Logger

class BlogMaker(Logger):
    def __init__(self,config_file='blog.toml',output=None):
        self.__config={
            'encoding':"GBK",
            'defaultLayout':"post",
            'outputPath':"dist",
            'font':{
                'ascii':"Times New Roman",
                'cjk':"宋体"
            },
        }
        try:
            with open(config_file, 'rb') as f:
                self.__config.update(tomllib.load(f))
        except FileNotFoundError as e:
            click.echo(click.style(f'Failed to load {config_file}: {e}',fg='red'),err=True)
        except tomllib.TOMLDecodeError as e:
            click.echo(click.style(f'Failed to load {config_file}: {e}',fg='red'),err=True)
        if output is not None:
            self.__config['outputPath']=output

    def parse(self):
        click.echo(self.__config)


@click.group(invoke_without_command=True)
@click.option('--config_file','-c',default='blog.toml',
              help='Specify TOML config file.')
@click.option('--output','-o',default=None,
              help='Specify Output Path')
@click.pass_context
def main(ctx,config_file,output):
    sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
    blogMaker=BlogMaker(config_file,output)
    blogMaker.parse()

if '__main__'==__name__:
    main()

