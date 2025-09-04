org 0h
push si
mov si,0
push ds
mov ax,0
mov ds,ax
push es
push bp
sub sp,8
mov bp,sp
mov ax,ss
mov es,ax
mov di,bp
mov cx,4
cld
rep movsw
mov ax,[bp]
mov ds,ax
mov si,[bp+2]
mov ax,[bp+4]
mov es,ax
mov di,[bp+6]
mov cx,0
initnums_loop:
cmp cx,9999
ja initnums_finish
mov ax,cx
call int2bcd
jc initnums_nextnum
mov es:[di],ax
inc di
inc di
initnums_nextnum:
mov [si],ax
inc si
inc si
inc cx
jmp initnums_loop
initnums_finish:
add sp,8
pop bp
pop es
pop ds
pop si
retf
int2bcd:
push bx
push cx
push dx
mov bx,10
xor dx,dx
div bx
mov cl,dl
xor dx,dx
div bx
mov ch,dl
xor dx,dx
div bx
mov bl,dl
mov bh,al
mov ah,al
shl ah,4
or ah,dl
mov al,ch
shl al,4
or al,cl
cmp bh,bl
je int2bcd_dupdigit
cmp bh,ch
je int2bcd_dupdigit
cmp bh,cl
je int2bcd_dupdigit
cmp bl,ch
je int2bcd_dupdigit
cmp bl,cl
je int2bcd_dupdigit
cmp ch,cl
je int2bcd_dupdigit
clc
jmp int2bcd_finish
int2bcd_dupdigit:
stc
int2bcd_finish:
pop dx
pop cx
pop bx
ret

