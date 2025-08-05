#!/usr/bin/env python3

mailCenter=MailCenter()

async def service_handler_pop3(reader,writer):
    try:
        srv=POP3Service(reader,writer)
        await srv.run()
    except (asyncio.TimeoutError, ConnectionResetError, BrokenPipeError):
        pass
    except Exception as e:
        print_exc()
    finally:
        if not writer.is_closing():
            writer.close()
            await writer.wait_closed()

async def service_handler_smtp(reader,writer):
    try:
        srv=SMTPService(reader,writer)
        await srv.run()
    except (asyncio.TimeoutError, ConnectionResetError, BrokenPipeError):
        pass
    except Exception as e:
        print_exc()
    finally:
        if not writer.is_closing():
            writer.close()
            await writer.wait_closed()

server_pop3=None
server_smtp=None

def close_server(a,b):
    global server_pop3,server_smtp
    if server_pop3 is not None:
        server_pop3.close()
    if server_smtp is not None:
        server_smtp.close()

async def main(args):
    global mailCenter,server_pop3,server_smtp
    server_pop3,server_smtp,dummy = await asyncio.gather(
        asyncio.start_server(service_handler_pop3,host=args.host,port=args.port_pop3),
        asyncio.start_server(service_handler_smtp,host=args.host,port=args.port_smtp),
        mailCenter.load(args.config)
    )
    loop = asyncio.get_event_loop()
    for s in (signal.SIGINT, signal.SIGTERM):
        if 'Windows'==platform.system():
            signal.signal(s, close_server)
        else:
            loop.add_signal_handler(s, lambda:close_server(None,None))
    try:
        async with server_pop3:
            async with server_smtp:
                await asyncio.gather(server_pop3.serve_forever(), server_smtp.serve_forever())
    except (asyncio.exceptions.CancelledError, KeyboardInterrupt):
        pass
    except Exception as e:
        print_exc()
    finally:
        mailCenter.close()
        await asyncio.gather(server_pop3.wait_closed(), server_smtp.wait_closed())

if '__main__'==__name__:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--host',
        help='Specify binding host for the e-mail server.',
        default=''
    )
    parser.add_argument(
        '--port_pop3',
        help='Specify port for the e-mail server.',
        type=int,
        default=110
    )
    parser.add_argument(
        '--port_smtp',
        help='Specify port for the e-mail server.',
        type=int,
        default=25
    )
    parser.add_argument(
        '--config',
        '-c',
        help='Specify config file for the e-mail server.',
        default='./mail-server.json'
    )
    args = parser.parse_args()
    asyncio.run(main(args))

