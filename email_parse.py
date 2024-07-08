msg_raw=b'Message-ID: <MAPI.Id.0016.00616120202020203030303330303033@MAPI.to.RFC822>\r\nPriority: Normal\r\nX-MSMail-Priority: Normal\r\nX-Priority: 3\r\nTo: hahaha@10.0.2.2\r\nMIME-Version: 1.0\r\nFrom: "frank" <frank@10.0.2.2>\r\nSubject: Fw: ~{2bJTSJ<~~}\r\nDate: Sat, 06 Jul 24 08:50:09 PDT\r\nContent-Type: text/plain; charset="HZ-GB-2312"; X-MAPIextension=".TXT"\r\nContent-Transfer-Encoding: 7bit\r\n\r\n\r\naaaaa~{9~9~~}\r\n----------\r\n> Date: ~{PGFZAy~}, 7 06, 2024 08:49:11 \r\n> From: aaa\r\n> To: hahaha@10.0.2.2\r\n> Subject: ~{2bJTSJ<~~}\r\n> \r\n> ~{NRR*2bJTOB~}\r\n\r\n'

import email
from email.header import decode_header
from codecs import decode

msg = email.message_from_bytes(msg_raw)
print(decode(msg['subject'].encode('iso8859-1'), msg.get_content_charset()))
print(decode(msg.get_payload().encode('iso8859-1'), msg.get_content_charset()))