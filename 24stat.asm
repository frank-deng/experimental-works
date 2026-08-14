.model tiny
.8086
assume cs:code,ds:code,es:code,ss:code
code segment
org 100h
start:
mov ax,0
mov bx,0
call fracdisp
call newline
call fracdisp
call newline
mov ax,1
mov bx,3
mov cx,1
mov dx,5
mov si,3
call frac_oper
call fracdisp
call newline
mov ax,1
mov bx,3
mov cx,2
mov dx,5
mov si,0
call frac_oper
call fracdisp
call newline
mov ax,1
mov bx,3
mov cx,2
mov dx,5
mov si,1
call frac_oper
call fracdisp
call newline
mov ax,1
mov bx,0
mov cx,2
mov dx,0
mov bx,0
call frac_oper
call fracdisp
call newline

mov ax,1
push ax
mov ax,2
push ax
mov ax,3
push ax
mov ax,4
push ax
mov ax,0
push ax
mov ax,3
push ax
mov ax,1
push ax
call expr_abcdsss
call fracdisp
call newline
call expr_abcsdss
call fracdisp
call newline
call expr_abcssds
call fracdisp
call newline

mov ax, 4C00h
int 21h

;a=+16 b=+14 c=+12 d=+10 s0=+8 s1=+6 s2=+4
expr_abcdsss:
push bp
mov bp,sp
mov ax,word ptr[bp+12]
mov bx,1
mov cx,word ptr[bp+10]
mov dx,1
mov si,word ptr[bp+8]
call frac_oper
mov cx,ax
mov dx,bx
mov ax,word ptr[bp+14]
mov bx,1
mov si,word ptr[bp+6]
call frac_oper
mov cx,ax
mov dx,bx
mov ax,word ptr[bp+16]
mov bx,1
mov si,word ptr[bp+4]
call frac_oper
pop bp
ret

expr_abcsdss:
push bp
mov bp,sp
mov ax,word ptr[bp+14]
mov bx,1
mov cx,word ptr[bp+12]
mov dx,1
mov si,word ptr[bp+8]
call frac_oper
mov cx,word ptr[bp+10]
mov dx,1
mov si,word ptr[bp+6]
call frac_oper
mov cx,ax
mov dx,bx
mov ax,word ptr[bp+16]
mov bx,1
mov si,word ptr[bp+4]
call frac_oper
pop bp
ret

expr_abcssds:
push bp
mov bp,sp
mov ax,word ptr[bp+14]
mov bx,1
mov cx,word ptr[bp+12]
mov dx,1
mov si,word ptr[bp+8]
call frac_oper
mov cx,ax
mov dx,bx
mov ax,word ptr[bp+16]
mov bx,1
mov si,word ptr[bp+6]
call frac_oper
mov cx,word ptr[bp+10]
mov dx,1
mov si,word ptr[bp+4]
call frac_oper
pop bp
ret

frac_oper:
test bx,bx
jz frac_oper_zero
test dx,dx
jz frac_oper_zero
and si,3
shl si,1
mov si,frac_oper_table[si]
jmp si
frac_oper_zero:
xor ax,ax
xor bx,bx
ret

frac_mul:
push dx
xchg ax,bx
imul dx
xchg ax,bx
imul cx
pop dx
ret

frac_div:
push dx
imul dx
xchg ax,bx
imul cx
xchg ax,bx
pop dx
ret

frac_add:
mov si,ax
mov di,dx
mov ax,cx
imul bx
mov cx,ax
mov ax,bx
imul di
mov bx,ax
mov ax,si
imul di
add ax,cx
ret

frac_sub:
mov si,ax
mov di,dx
mov ax,cx
imul bx
mov cx,ax
mov ax,bx
imul di
mov bx,ax
mov ax,si
imul di
sub ax,cx
ret

int162str:
push ax
push bx
push cx
push dx
push si
push di
mov si,di
inc di
mov bx,10
xor cx,cx
or ax,ax
jns int162str_div_loop
neg ax
mov byte ptr es:[di],'-'
inc di
int162str_div_loop:
xor dx,dx
div bx
push dx
inc cx
or ax,ax
jnz int162str_div_loop
int162str_store:
pop dx
add dl,'0'
mov byte ptr es:[di],dl
inc di
loop int162str_store
int162str_end:
mov bx,di
sub bx,si
dec bx
mov byte ptr es:[si],bl
pop di
pop si
pop dx
pop cx
pop bx
pop ax
ret

int16disp:
push bp
mov bp,sp
push ax
push bx
push cx
push dx
push ds
push es
mov bx,ss
mov ds,bx
mov es,bx
mov di,bp
sub di,8
call int162str
mov ah,40h
mov bx,1
xor ch,ch
mov cl,byte ptr [di]
mov dx,di
inc dx
int 21h
pop es
pop ds
pop dx
pop cx
pop bx
pop ax
pop bp
ret

fracdisp:
call int16disp
push ax
push dx
mov ah,02h
mov dl,'/'
int 21h
pop dx
pop ax
xchg ax,bx
call int16disp
xchg ax,bx
ret

newline:
push ax
push dx
mov ah,02h
mov dl,0dh
int 21h
mov dl,0ah
int 21h
pop dx
pop ax
ret

frac_oper_table dw frac_add,frac_sub,frac_mul,frac_div
perm:
db 0,1,2,3, 0,1,3,2, 0,2,1,3, 0,2,3,1, 0,3,1,2, 0,3,2,1
db 1,0,2,3, 1,0,3,2, 1,2,0,3, 1,2,3,0, 1,3,0,2, 1,3,2,0
db 2,0,1,3, 2,0,3,1, 2,1,0,3, 2,1,3,0, 2,3,0,1, 2,3,1,0
db 3,0,1,2, 3,0,2,1, 3,1,0,2, 3,1,2,0, 3,2,0,1, 3,2,1,0

code ends
end start

