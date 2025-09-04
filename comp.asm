org 0h
push si
mov si,0
push ds
mov ax,0
mov ds,ax
push bp
mov ax,[si]
cmp ax,1
je do_comp
jmp main_finish
do_comp:
mov ax,[si+2]
mov bx,[si+4]
call comp
mov [si],ax
jmp main_finish
main_finish:
pop bp
pop ds
pop si
retf

comp:
cmp ax,bx
jne comp_main
mov ax,0x40
ret
comp_main:
push bx
push cx
push dx
push bp
push es
push di
sub sp,20
mov bp,sp
xchg al,bh
mov dx,ax
mov ax,ss
mov es,ax
xor ax,ax
mov di,bp
mov cx,10
cld
rep stosw
mov cx,bx
and cx,0xf0f
call comp_writeres
mov cx,bx
shr cx,4
and cx,0xf0f
call comp_writeres
mov cx,dx
and cx,0xf0f
call comp_writeres
mov cx,dx
shr cx,4
and cx,0xf0f
call comp_writeres
mov cx,10
mov di,0
comp_countb:
mov bx,[bp+di]
cmp bh,bl
jl comp_countb_min
add al,bl
jmp comp_countb_next
comp_countb_min:
add al,bh
comp_countb_next:
inc di
inc di
loop comp_countb
comp_finish:
add sp,20
pop di
pop es
pop bp
pop dx
pop cx
pop bx
ret
comp_writeres:
cmp ch,cl
je comp_a
mov di,cx
xor ch,ch
xchg cx,di
shl di,1
inc byte ss:[bp+di]
mov cl,ch
xor ch,ch
mov di,cx
shl di,1
inc byte ss:[bp+1+di]
ret
comp_a:
add al,0x10
ret
