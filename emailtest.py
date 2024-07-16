import email,asyncio
from email.header import decode_header
from codecs import decode
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from traceback import print_exc

async def run(recvQueue,sendQueue):
    while True:
        msgInfo=await recvQueue.get()
        try:
            print(msgInfo['msg'])
            msg = email.message_from_bytes(msgInfo['msg'])
            encoding = msg.get_content_charset().lower()
            msg2 = MIMEMultipart()
            msg2['From']='test@10.0.2.2'
            msg2['To']=msg['From']
            msg2['Subject']="Fw: "+msg['subject']
            msg2.attach(MIMEText(msg.get_payload(),'plain'))
            msgNew={
                'from':'test',
                'to':msgInfo['from'],
                'msg':msg2.as_bytes()
            }
        except:
            print_exc()
        sendQueue.put_nowait(msgNew)