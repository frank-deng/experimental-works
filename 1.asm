org 100h
push si
mov si,0
push ds
mov ax,0
mov ds,ax
push bp
mov ax,[si]
cmp ax,[si+2]
jne mainproc
mov word[si+4],0x40
pop bp
pop ds
pop si
retf
mainproc:
mov word[si+4],0
sub sp,30
mov bp,sp
mov word[bp],3
push es
push di
mov ax,ss
mov es,ax
mov di,bp
inc di
inc di
mov cx,10
xor ax,ax
cld
rep stosw
pop di
pop es
procnums:
mov bx,10
mov ax,[si]
cwd
div bx
mov [si],ax
mov cx,dx
mov ax,[si+2]
cwd
div bx
mov [si+2],ax
call writeres
dec word[bp]
jnz procnums
mov cx,[si]
mov dx,[si+2]
call writeres
mov cx,10
mov di,0
countb:
xor bx,bx
mov ax,[bp+2+di]
cmp ah,al
jl countb_min
mov bl,al
add [si+4],bx
jmp countb_finish
countb_min:
mov bl,ah
add [si+4],bx
countb_finish:
inc di
inc di
loop countb
finish:
add sp,30
pop bp
pop di
pop si
retf

writeres:
cmp cx,dx
jne notmatch
add word[si+4],0x10
ret
notmatch:
mov di,cx
shl di,1
inc byte ss:[bp+2+di]
mov di,dx
shl di,1
inc byte ss:[bp+3+di]
ret

