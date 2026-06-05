#!/usr/bin/env python3
#-*- coding:utf-8-*

import asyncio,json,os,sys,re,subprocess
import aiohttp
import tempfile
import click
import json
import git
from pathlib import Path


class CodeWriterDeepSeek:
    DEEPSEEK_URL='https://api.deepseek.com/chat/completions'
    TOOLS=[
        {
            "type":"function",
            "function":{
                "name":"file_reader",
                "strict":True,
                "description":"读取文件内容",
                "parameters":{
                    "type":"object",
                    "properties":{
                        "fpath":{
                            "type":"string",
                            "description":"文件名放这边"
                        }
                    },
                    "required":["fpath"]
                }
            }
        },
        {
            "type":"function",
            "function":{
                "name":"file_writer",
                "strict":True,
                "description":"往指定文件名写内容，没这个文件的话就新建",
                "parameters":{
                    "type":"object",
                    "properties":{
                        "fpath":{
                            "type":"string",
                            "description":"文件名放这边，往这个文件里放内容"
                        },
                        "content":{
                            "type":"string",
                            "description":"要写的东东放这"
                        },
                    },
                    "required":["fpath","content"]
                }
            }
        },
    ]

    @staticmethod
    async def file_reader(fpath):
        with open(fpath,'r',encoding='utf-8') as f:
            return f.read()

    @staticmethod
    asybc def file_writer(fpath,content):
        file_path = Path(fpath)
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content)

    def __init__(self):
        self.TOOL_CALL={
            'file_reader':CodeWriterDeepSeek.file_reader,
            'file_writer':CodeWriterDeepSeek.file_writer,
        }
        env_key='DEEPSEEK_KEY'
        self._key=os.environ.get(env_key)
        if not self._key:
            raise KeyError(f'Environ {env_key} not set.')
        self._headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+self._key
        }
    
    async def call_ai(self,messages,tools):
        jsonData={
            "model": "deepseek-v4-pro",
            "thinking": {"type": "enabled"},
            "stream": False,
            "messages": messages,
            "tools":tools
        }
        timeout=aiohttp.ClientTimeout(total=300)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(self.DEEPSEEK_URL, headers=self._headers,
                                    json=jsonData) as response:
                return await response.json()

    async def call_tools(self,tool_calls):
        res={}
        for tool_call in tool_calls:
            call_id=tool_call['id']
            func_name=tool_call['function']['name']
            if not hasattr(self,func_name):
                continue
            args=json.loads(tool_call['function']['arguments'])
            res[call_id]=await getattr(self,func_name)(**args)
        return res

    async def run(self,question,max_rounds=6):
        messages=[
            {
                "role":"user",
                "content":question
            }
        ]
        for round_idx in range(max_rounds):
            res=await self.call_ai(messages,tools)
            last_choice=res['choices'][-1]
            finish_reason=last_choice['finish_reason']
            last_msg=last_choice['message']
            tool_calls=last_msg.get('tool_calls')
            print(last_msg['content'])
            if finish_reason!='tool_calls' or not tool_calls:
                break
            messages.append(last_msg)
            tool_content={}
            try:
                tool_content=await self.call_tools(tool_calls)
            except Exception:
                raise
            for call_id in tool_content:
                messages.append({
                    "role":"tool",
                    "tool_call_id":call_id,
                    "content":tool_content[call_id]
                })


def edit_question(question):
    temp_path=None
    try:
        repo=git.Repo('.', search_parent_directories=True)
        temp_file=tempfile.NamedTemporaryFile(
            mode='w+t',
            dir=repo.working_tree_dir,
            prefix='question_',
            suffix='.txt',
            delete=False
        )
        temp_path=Path(temp_file.name)
        temp_file.write(question)
        temp_file.flush()
        temp_file.close()
        cmd=os.environ.get('EDITOR','vim').split()
        cmd.append(str(temp_path))
        proc=subprocess.Popen(cmd)
        if proc is None:
            raise RuntimeError('Failed to launch editor.')
        proc.wait()
        with open(temp_path,'r',encoding='utf-8') as f:
            return f.read()
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink()


async def main(question):
    try:
        question=' '.join(question)+'\n\n'
        if not sys.stdin.isatty():
            for line in sys.stdin:
                question+=line
        if sys.stdout.isatty() and sys.stdin.isatty():
            question=edit_question(question)
        question=question.rstrip('\n\r')
        if not question:
            click.secho('Empty question.',fg='yellow',err=True)
            return 1
        worker=CodeWriterDeepSeek()
        await worker.run(question)
        return 0
    except (BrokenPipeError,KeyboardInterrupt):
        return 0
    except git.exc.InvalidGitRepositoryError:
        click.secho('Not in a git repository.',fg='red',err=True)
        return 1
    except (RuntimeError,KeyError,FileNotFoundError,ValueError) as e:
        click.secho(e,fg='red',err=True)
        return 1


@click.command(context_settings={
    'help_option_names': ['-h', '--help', '-?'],
    'ignore_unknown_options': True,
    'show_default': False,
})
@click.argument('question',nargs=-1,required=False)
def cli(question):
    asyncio.run(main(question))
    

if '__main__'==__name__:
    cli()

