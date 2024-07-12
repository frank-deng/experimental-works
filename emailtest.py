import email,asyncio
from email.header import decode_header
from codecs import decode

async def run(recvQueue,sendQueue):
    print('emailtest running')
    while True:
        msgInfo=await recvQueue.get()
        recvQueue.task_done()
        msg = email.message_from_bytes(msgInfo['msg'])
        print(decode(msg['subject'].encode('iso8859-1'), msg.get_content_charset()))
        print(decode(msg.get_payload().encode('iso8859-1'), msg.get_content_charset()))


