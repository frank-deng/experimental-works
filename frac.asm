org 100h

mov ax,3
mov bx,2
mov cx,7
mov dx,6
mov bp,3
call fraccalc
call print_frac

mov ax,3
mov bx,2
mov cx,7
mov dx,6
mov bp,2
call fraccalc
call print_frac

mov ax,7
mov bx,6
mov cx,3
mov dx,2
mov bp,0
call fraccalc
call print_frac

mov ax,3
mov bx,2
mov cx,7
mov dx,6
mov bp,1
call fraccalc
call print_frac
ret

fraccalc:
push bp
push dx

;a*d/b*c
cmp bp,3
je fracdiv

;a*c/b*d
cmp bp,2
je fracmul

;a*d+b*c / b*d
cmp bp,0
je fracadd

;a*d-b*c / b*d
cmp bp,1
je fracsub

jmp fracfinish

fracadd:
push cx
mov cx,dx
mov bp,bx

;a*d
cwd
imul cx
xchg ax,bx

;b*d
cwd
imul cx

;b*c
xchg ax,bx
xchg ax,bp
pop cx
cwd
imul cx

add ax,bp
jmp fracfinish

fracsub:
push cx
mov cx,dx
mov bp,bx

;a*d
cwd
imul cx
xchg ax,bx

;b*d
cwd
imul cx

;b*c
xchg ax,bx
xchg ax,bp
pop cx
cwd
imul cx

xchg ax,bp
sub ax,bp
jmp fracfinish

fracmul:
;d*b
mov bp,ax
mov ax,dx
cwd
imul bx
mov bx,ax

;a*c
mov ax,bp
cwd
imul cx
jmp fracfinish

fracdiv:
;a*d
mov bp,cx
mov cx,dx
cwd
imul cx

;ax=b,bx=a*d
xchg ax,bx

;b*c
mov cx,bp
cwd
imul cx

;ax=bx,bx=b*c
xchg ax,bx

fracfinish:
pop dx
pop bp
ret

printnum:
cmp ax,0
je printnum_zero
push ax
push bx
push cx
push dx
mov bx,10
xor cx,cx
getnum:
cwd
div bx
push dx
inc cx
cmp ax,0
jne getnum
mov bx,0x7
outnum:
pop ax
add al,'0'
mov ah,0x0e
int 0x10
loop outnum
pop dx
pop cx
pop bx
pop ax
ret
printnum_zero:
mov ax,0x0e30
int 0x10
ret

print_frac:
push ax
push bx
push bx
mov bx,0x7
call printnum
mov ax,0x0e2f
int 0x10
pop ax
call printnum
mov ax,0x0e0d
int 0x10
mov ax,0x0e0a
int 0x10
pop bx
pop ax
ret
