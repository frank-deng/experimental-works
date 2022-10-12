DECLARE SUB InitEnv ()
DEFINT A-Z

DIM SHARED BITMASK(8)
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

CALL InitEnv
LOCATE 1, 1, 0: SCREEN 1: CLS

CALL DrawChar("M",0,0,2,56,70,3)

WHILE INPUT$(1) = "": WEND
SCREEN 0: LOCATE ,,1: CLS : END

SUB DrawChar(STR AS STRING, X0 AS INTEGER, Y0 AS INTEGER, FONT AS INTEGER, W AS INTEGER, H AS INTEGER, C AS INTEGER)
    STATIC Param AS FontDataT
    DIM BITMAP(8192) AS INTEGER
    IF ASC(MID$(STR,1,1)) < &H80 THEN
        Param.CH0=STR: Param.CH1=CHR$(0)
        Param.W=W/2
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
    REM PRINT "": PRINT HEX$(SI);",";HEX$(DI);",";HEX$(DS);",";HEX$(ES);",";HEX$(VARSEG(ASMINT7E(0)))
    DEF SEG=VARSEG(ASMINT7E(0))
    OFFSET=VARPTR(ASMINT7E(0))
    POKE OFFSET+7, SI0: POKE OFFSET+8, SI1
    POKE OFFSET+10, DI0: POKE OFFSET+11, DI1
    POKE OFFSET+13, DS0: POKE OFFSET+14, DS1
    POKE OFFSET+16, ES0: POKE OFFSET+17, ES1
    REM FOR I=0 TO 30: PRINT HEX$(PEEK(VARPTR(ASMINT7E(0))+I));",";: NEXT I
    REM DEF SEG=VARSEG(Param): PRINT "": FOR I=0 TO 15: PRINT HEX$(PEEK(VARPTR(Param)+I));",";: NEXT I: DEF SEG
    DEF SEG=VARSEG(ASMINT7E(0)): CALL ABSOLUTE(VARPTR(ASMINT7E(0))): DEF SEG
    REM PRINT HEX$(SI0);",";HEX$(SI1);" - ";HEX$(DI0);",";HEX$(DI1);" - ";HEX$(DS0);",";HEX$(DS1);" - ";HEX$(ES0);",";HEX$(ES1)
    W0=Param.W
    DEF SEG=VARSEG(BITMAP(0)): ROWBYTES=(W0+7)\8
    FOR Y=0 TO 69: FOR X=0 TO (W0-1)
        PX=PEEK(VARPTR(BITMAP(0))+ROWBYTES*Y+(X\8))
        IF PX AND BITMASK(X AND 7) THEN PSET (X0+X,Y0*Y),CL
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
END SUB