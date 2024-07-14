import email,asyncio
from email.header import decode_header
from codecs import decode
from traceback import print_exc

ENCODING_CONV={
    'CN-GB':'GB2312'
}

async def run(recvQueue,sendQueue):
    while True:
        msgInfo=await recvQueue.get()
        try:
            msg = email.message_from_bytes(msgInfo['msg'])
            encoding = msg.get_content_charset().upper()
            encoding = ENCODING_CONV.get(encoding,encoding)
            print(msg['subject'])
            print(msg.get_payload())
            msgNew={
                'from':'test',
                'to':msgInfo['from'],
                'msg':msgInfo['msg']
            }
        except:
            print_exc()
        print('send mail',sendQueue)
        sendQueue.put_nowait(msgNew)
        print('send mail ok')

