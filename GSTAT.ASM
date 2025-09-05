org 0h
push si
mov si,0
push ds
mov ax,0
mov ds,ax
push bp
mov ax,[si]
cmp ax,2
je do_process_nums
cmp ax,1
je do_comp
main_finish:
pop bp
pop ds
pop si
retf

do_comp:
mov ax,[si+2]
mov bx,[si+4]
call comp
mov [si],ax
jmp main_finish

;ans,guess,table_len,ds,si,es,di
do_process_nums:
mov ax,[si+2]
mov bx,[si+4]
call comp
mov [si],ax
cmp ax,0x40
je main_finish
push ds
push si
push ax
mov bp,sp
mov word[bp],0
mov dx,ax
mov bx,[si+4]
mov di,[si+14]
mov cx,[si+6]
mov ax,[si+12]
mov es,ax
mov ax,[si+8]
mov si,[si+10]
mov ds,ax
proc_loop:
mov ax,[si]
cmp ax,bx
je proc_next_num
call comp
cmp ax,dx
jne proc_next_num
mov ax,[si]
mov es:[di],ax
inc di
inc di
inc word[bp]
proc_next_num:
inc si
inc si
loop proc_loop
pop ax
pop si
pop ds
mov [si+2],ax
jmp main_finish

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
