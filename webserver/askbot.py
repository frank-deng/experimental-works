import asyncio
import aiohttp
from mailcenter import MailUserRobot

class MailUserRobotDeepseek(MailUserRobot):
    async def _handler(self,email_id):
        uid=self._uid
        email_detail=await self._MailCenter.mail_detail(uid,email_id)
        if not email_detail:
            return
        email=email_detail[0]
        subject=f'Re: {email['subject']}'
        body='Miao'
        await self._MailCenter.send(uid,[email['from_uid']],[],
                                    subject,body,email_id)
        await self._MailCenter.mark_read(uid,email_id)

