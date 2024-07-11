#!/usr/bin/env python3

import asyncio,signal,json,hashlib,subprocess,os,time,re
import email
from traceback import print_exc

login_timeout = 60

async def read_data(reader):
    res=b''
    running=True
    while running:
        char=await asyncio.wait_for(reader.read(1), timeout=login_timeout)
        val=int.from_bytes(char,'little')
        if 0==val: #Connection closed
            raise BrokenPipeError
        elif 0x0d==val or 0x0a==val or 0==val: #Finished
            running=False
        elif val>=0x20 and val<=0x7e and len(res)<max_len:
            res+=val.to_bytes(1,'little')
    return res

async def service_main(reader,writer):
    global loginInfo
    writer.write(b'220 mysite.net\r\n')
    await writer.drain()

    # Greeting
    content=await asyncio.wait_for(reader.read(1000), timeout=60)
    print(content)
    writer.write(b'250 OK\r\n')
    await writer.drain()

    running=True
    receiveData=False
    while running:
        content=await asyncio.wait_for(reader.read(1000), timeout=60)
        if b'' == content:
            running=False
        if b'DATA\r\n' == content:
            writer.write(b'354 End data with <CR><LF>.<CR><LF>\r\n')
            await writer.drain()
            receiveData=True
        elif re.search(rb'^QUIT', content) is not None:
            running=False
        elif re.search(rb'^\r\n.\r\n', content):
            writer.write(b'250 Mail OK\r\n')
            await writer.drain()
        elif not receiveData:
            print(content)
            writer.write(b'250 Mail OK\r\n')
            await writer.drain()
        else:
            print(content)
            email_message = email.message_from_string(content.decode('utf8'))
            print(email_message)
    print('Finished')
    return running

async def service_handler(reader,writer):
    try:
        await service_main(reader,writer)
        print('Connection closed')
    except asyncio.TimeoutError:
        writer.write(b'\r\n\r\nTimeout!!\r\n')
    except ConnectionResetError:
        print('Connection reset')
    except BrokenPipeError:
        print('Broken pipe')
    except Exception as e:
        print_exc()
    finally:
        if not writer.is_closing():
            writer.close()
            await writer.wait_closed()

async def main(host,port):
    server=await asyncio.start_server(service_handler,host=host,port=port)
    loop = asyncio.get_event_loop()
#    for s in (signal.SIGINT, signal.SIGTERM):
#        loop.add_signal_handler(s, lambda: server.close())
    try:
        async with server:
            await server.serve_forever()
    except asyncio.exceptions.CancelledError:
        pass
    finally:
        await server.wait_closed()

if '__main__'==__name__:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--host',
        '-H',
        help='Specify binding host for the PPP server.',
        default=''
    )
    parser.add_argument(
        '--port',
        '-P',
        help='Specify port for the PPP server.',
        type=int,
        default=25
    )
    args = parser.parse_args();
    asyncio.run(main(args.host,args.port))
