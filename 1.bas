DECLARE SUB InitEnv ()
DEFINT A-Z

DIM SHARED BITMASK(8)
DIM SHARED SCALEMAP(256)
DIM SHARED ASMINT7E(31)
TYPE FontDataT
    CH0 AS STRING * 1
    CH1 AS STRING * 1
    FONT AS INTEGER
    W AS INTEGER
    H AS INTEGER
    TOP AS INTEGER
    BOTTOM AS INTEGER
    ATTR AS INTEGER
    BUFLEN AS INTEGER
END TYPE
DIM SHARED BITMAP(8194) AS INTEGER
TYPE BMPHeaderT
    id AS STRING * 2      'Should be "BM"
    size AS LONG          'Size of the data
    rr1 AS INTEGER        '
    rr2 AS INTEGER        '
    offset AS LONG        'Position of start of pixel data
    horz AS LONG          '
    wid AS LONG           'Image width
    hei AS LONG           'Image height
    planes AS INTEGER     '
    bpp AS INTEGER        'Should read 8 for a 256 colour image
        pakbyte AS LONG       '
        imagebytes AS LONG    'Width*Height
        xres AS LONG          '
        yres AS LONG          '
        colch AS LONG         '
        ic AS LONG            '
        pal AS STRING * 8  'Stored as &amp;lt;Blue, Green, Red, 0&amp;gt;
END TYPE

CALL InitEnv
LOCATE 1, 1, 0: SCREEN 1: CLS

CALL DrawBMP
CALL DrawStr("Moon River",7,20,2,56,70,1)
CALL DrawStr("Audrey Hepburn",49,148,10,32,32,2)

WHILE INPUT$(1) = "": WEND
SCREEN 0: WIDTH 80: LOCATE ,,1: CLS : END

SUB DrawBMP
    STATIC header AS BMPHeaderT
    STATIC Row AS STRING*40
    BITMAP(0)=640: BITMAP(1)=200
    OPEN "MOONRIVR.BMP" FOR BINARY AS #1
    GET #1,,header
    IF header.bpp<>1 OR header.wid<>320 OR header.hei<> 200 THEN
        PRINT "Unsupported BMP": EXIT SUB
    END IF
    FOR Y=0 TO header.hei-1
      GET #1,header.offset+(header.hei-1-Y)*40+1,Row
      FOR X=0 TO 39
        BITMAP(Y*40+X+2)=SCALEMAP(ASC(MID$(Row,X+1,1)))
      NEXT X
    NEXT Y
    CLOSE #1
    PUT (0,0),BITMAP,PSET
END SUB

SUB DrawStr(STR AS STRING, X1 AS INTEGER, Y1 AS INTEGER, FONT AS INTEGER, W0 AS INTEGER, H AS INTEGER, C AS INTEGER)
    I=0: L=LEN(STR): WA=W0: XA=X1
    WHILE I<L
        CH$=MID$(STR,I+1,1)
        IF ASC(CH$)>=&H80 THEN
            I=I+1: CH$=CH$+MID$(STR,I+1,1)
        END IF
        WA=W0: CALL DrawChar(CH$,XA,Y1,FONT,WA,H,C)
        XA=XA+WA: I=I+1
    WEND
END SUB

SUB DrawChar(STR AS STRING, X0 AS INTEGER, Y0 AS INTEGER, FONT AS INTEGER, W AS INTEGER, H AS INTEGER, C AS INTEGER)
    STATIC Param AS FontDataT
    IF ASC(MID$(STR,1,1)) < &H80 THEN
        Param.CH0=STR: Param.CH1=CHR$(0)
        Param.W=W\2
    ELSE
        Param.CH0=MID$(STR,2,1): Param.CH1=MID$(STR,1,1)
        Param.W=W
    END IF
    Param.FONT=FONT: Param.H=H
    Param.TOP=0: Param.BOTTOM=H-1
    Param.ATTR=1: Param.BUFLEN=16384
    DS=VARSEG(Param): ES=VARSEG(BITMAP(0))
    SI=VARPTR(Param): DI=VARPTR(BITMAP(0))
    DEF SEG=VARSEG(SI): SI0=PEEK(VARPTR(SI)): SI1=PEEK(VARPTR(SI)+1)
    DEF SEG=VARSEG(DI): DI0=PEEK(VARPTR(DI)): DI1=PEEK(VARPTR(DI)+1)
    DEF SEG=VARSEG(DS): DS0=PEEK(VARPTR(DS)): DS1=PEEK(VARPTR(DS)+1)
    DEF SEG=VARSEG(ES): ES0=PEEK(VARPTR(ES)): ES1=PEEK(VARPTR(ES)+1)
    DEF SEG=VARSEG(ASMINT7E(0))
    OFFSET=VARPTR(ASMINT7E(0))
    POKE OFFSET+7, SI0: POKE OFFSET+8, SI1
    POKE OFFSET+10, DI0: POKE OFFSET+11, DI1
    POKE OFFSET+13, DS0: POKE OFFSET+14, DS1
    POKE OFFSET+16, ES0: POKE OFFSET+17, ES1
    DEF SEG=VARSEG(ASMINT7E(0)): CALL ABSOLUTE(VARPTR(ASMINT7E(0))): DEF SEG
    W=Param.W
    DEF SEG=VARSEG(BITMAP(0)): ROWBYTES=(W+7)\8: PX=VARPTR(BITMAP(0)): P=PEEK(PX)
    FOR Y=0 TO (H-1): FOR X=0 TO (W-1)
        IF P AND BITMASK(X AND 7) THEN PSET (X0+X,Y0+Y),C
        IF (X AND 7)=7 OR X=(W-1) THEN PX=PX+1: P=PEEK(PX)
    NEXT X: NEXT Y: DEF SEG
END SUB

DATA &H50,&H53,&H56,&HBE,&H0,&H0,&H2E,&HC7,&H4,&H0,&H0,&HB8,&H0,&HDB,&HCD,&H2F,&H3C,&HFF,&H75,&H17,&H81,&HFB,&H50,&H54,&H75,&H11,&HB8,&H1,&H0,&HCD,&H79,&H75,&HA,&HB8,&HB,&HFF,&HCD,&H16,&H2E,&HC7,&H4,&H1,&H0,&H5E,&H5B,&H58,&HCB
DATA &H1E,&H6,&H56,&H57,&H50,&H53,&HBE,&H0,&H0,&HBF,&H0,&H0,&HB8,&H0,&H0,&HBB,&H0,&H0,&H8E,&HD8,&H8E,&HC3,&HCD,&H7E,&H5B,&H58,&H5F,&H5E,&H7,&H1F,&HCB

SUB InitEnv
FOR I = 0 TO 7: BITMASK(I) = 2 ^ (7 - I): NEXT I
DIM A%(50)
DEF SEG = VARSEG(A%(0))
RESTORE
FOR I% = 0 TO 46
    READ D%
    IF I% = 4 THEN
       D% = VARPTR(A%(49)) MOD 256
    ELSEIF I% = 5 THEN
       D% = VARPTR(A%(49)) / 256
    END IF
    POKE VARPTR(A%(0)) + I%, D%
NEXT I%
CALL ABSOLUTE(VARPTR(A%(0)))
DEF SEG
IF A%(49) = 0 THEN
    PRINT "Please run RDNFT.COM first.": END
END IF
DEF SEG = VARSEG(ASMINT7E(0))
FOR I% = 0 TO 30
    READ D%: POKE VARPTR(ASMINT7E(0)) + I%, D%
NEXT I%

FOR I=0 TO 255
  V=0
  IF I AND BITMASK(4) THEN V=V OR &HC000
  IF I AND BITMASK(5) THEN V=V OR &H3000
  IF I AND BITMASK(6) THEN V=V OR &H0C00
  IF I AND BITMASK(7) THEN V=V OR &H0300
  IF I AND BITMASK(0) THEN V=V OR &H00C0
  IF I AND BITMASK(1) THEN V=V OR &H0030
  IF I AND BITMASK(2) THEN V=V OR &H000C
  IF I AND BITMASK(3) THEN V=V OR &H0003
  SCALEMAP(I)=V
NEXT I
END SUB