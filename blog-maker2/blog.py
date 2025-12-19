#!/usr/bin/env python3

import sys
import os
import re
import glob
import tomllib
import click
import dateutil
from datetime import datetime

class BlogMaker:
    PARSE_META=0
    PARSE_CONTENT=1
    def __init__(self,config_file='blog.toml',output=None):
        self.__config={
            'encoding':"GBK",
            'markdownPath':'posts',
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

    def process_markdown(self,fname,fp):
        step=BlogMaker.PARSE_META
        fnparsed=re.findall(r'^(19\d\d|20\d\d)(0\d|1[0-2])([0-2]\d|3[01])_([0-1]\d|2[0-3])([0-5]\d)(.*)\.md$',fname)
        if fnparsed is None:
            click.echo(click.style(f'Misformatted filename {fname}',fg='yellow'))
            return None,None
        meta={
            'Title':'',
            'Tags':[],
            'Date':datetime(*[int(n) for n in fnparsed[0][:5]])
        }
        content=''
        for line in fp:
            if step!=BlogMaker.PARSE_META:
                content+=line
                continue
            line=line.strip()
            if line=='---':
                step=BlogMaker.PARSE_CONTENT
                continue
            key,val=line.split(':')
            key=key.strip()
            val=val.strip()
            if key=='Tags':
                meta[key]=[v.strip() for v in val.split(',')]
            if key=='Date':
                meta[key]=dateutil.parse(val)
            else:
                meta[key]=val

    def parse(self):
        files=[f for f in glob.glob(os.path.join(self.__config['markdownPath'],'*.md')) if os.path.isfile(f)]
        files.reverse()
        for file in files:
            with open(file) as fp:
                self.process_markdown(file,fp)


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

