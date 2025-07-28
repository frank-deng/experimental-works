import logging
from util import Logger

class TestBoom(Logger):
    def boom(self,a=1):
        try:
            raise ValueError(f'Invalid param {a}')
        except:
            raise RuntimeError(f'BOOM {a}')

    def clean1(self):
        try:
            self.boom(1)
        finally:
            self.clean2()

    def clean2(self):
        try:
            self.boom(2)
        finally:
            self.clean3()

    def clean3(self):
        try:
            self.boom(3)
        finally:
            self.clean4()

    def clean4(self):
        self.boom(4)
        
if '__main__'==__name__:
    logging.basicConfig(
        level=logging.DEBUG
    )
    try:
        a=TestBoom()
        a.clean1()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        logging.getLogger(__name__).critical(e,exc_info=True)
