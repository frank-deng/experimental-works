import aiohttp,asyncio,json,sys
import email
from email.message import EmailMessage

msgRaw=b'Message-ID: <MAPI.Id.0016.0072616e6b2020203030303530303035@MAPI.to.RFC822>\r\nPriority: Normal\r\nX-MSMail-Priority: Normal\r\nX-Priority: 3\r\nTo: "test" <test@10.0.2.2>\r\nMIME-Version: 1.0\r\nFrom: "Frank" <frank@10.0.2.2>\r\nSubject: Python~{Hg:N=bNvSJ<~~}\r\nDate: Sun, 14 Jul 24 08:48:16 PDT\r\nContent-Type: text/plain; charset="HZ-GB-2312"; X-MAPIextension=".TXT"\r\nContent-Transfer-Encoding: 7bit\r\n\r\nPython~{Hg:N=bNvSJ<~~}\r\n\r\n'

ans2="""```python
import email
from email.header import decode_header                                          
def parse_email(raw_email):
    # 使用BytesIO模拟从文件或网络连接中读取原始邮件内容                             # 在实际情况下，raw_email可能来自文件、网络响应等
    from io import BytesIO
    msg = email.message_from_bytes(raw_email)                                   
    # 解析邮件头信息
    for header in ['From', 'To', 'Subject']:
        value, encoding = decode_header(msg.get(header))[0]                             if isinstance(value, bytes):
            value = value.decode(encoding or 'utf-8')
        print(f'{header}: {value}')
                                                                                    # 解析邮件正文（这里假设是文本类型）
    if msg.is_multipart():
        # 处理多部分邮件（例如，包含文本和附件）
        for part in msg.walk():                                                             content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
                                                                                            if content_type == "text/plain" and content_disposition.startswith('inline'):
                body = part.get_payload(decode=True)
                body = body.decode('utf-8')  # 假设正文是UTF-8编码                              print(f"Body: {body}")
                break  # 假设我们只关心第一个文本部分
    else:
        body = msg.get_payload(decode=True)                                             body = body.decode('utf-8')  # 假设正文是UTF-8编码
        print(f"Body: {body}")

# 示例：这里使用了一个硬编码的邮件原始内容，但在实际应用中，你需要从某个地方获取它

parse_email(raw_email)                                                          ```
注意：上述代码只是一个简单的示例，用于演示如何使用`email`模块解析邮件。在实际应 用中，邮件的解析可能会更复杂，因为邮件可能包含多种类型的附件、不同的编码、不同的字符集等。你可能需要根据你的具体需求来扩展和修改这个示例
"""

async def getAccessToken(client_id,client_secret):
    url='https://aip.baidubce.com/oauth/2.0/token'
    data={
        'grant_type':'client_credentials',
        'client_id':client_id,
        'client_secret':client_secret
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url,data=data) as response:
            res=json.loads(await response.text())
            if res is not None and 'access_token' in res:
                return res['access_token']
    return None
    
async def askBot(access_token,question):
    url=f"https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token={access_token}"
    jsonData={
        'messages':[
            {
                'role':'user',
                'content':question
            }
        ]
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url,json=jsonData) as response:
            res=json.loads(await response.text())
            return res.get('result',None)
    return None

async def handler(key,msg):
    question=None
    charset=None
    if msg.is_multipart():
        for part in msg.walk():
            content_type=part.get_content_type()
            content_encoding=part.get_content_transfer_encoding()
            if content_type in {'text/plain','text/html'}:
                charset=part.get_content_charset()
                question=part.get_payload(decode=True).decode(charset)
    else:
        charset=msg.get_content_charset()
        question=msg.get_payload(decode=True).decode(charset)
    if question is None:
        return
    access_token=await getAccessToken(key[0],key[1])
    ans=await askBot(access_token,question)
    msg2 = EmailMessage()
    msg2['From']='niwenwoda@10.0.2.2'
    msg2['To']=msg['From']
    msg2['Subject']="Re: "+msg['subject']
    msg2.set_content(ans.encode(charset),'text','plain',cte='7bit')
    msg2.set_param('charset',charset)
    return msg2

async def run(params,recvQueue,sendQueue):
    while True:
        msgInfo=await recvQueue.get()
        try:
            msg2=await handler(params['erine_key'],email.message_from_bytes(msgInfo['msg']))
            msgNew={
                'from':'test',
                'to':msgInfo['from'],
                'msg':msg2.as_bytes().replace(b'\n',b'\r\n')
            }
        except:
            print_exc()
        sendQueue.put_nowait(msgNew)