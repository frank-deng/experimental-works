.model tiny
.8086
assume cs:code,ds:code,es:code,ss:code
code segment
org 100h
start:
mov ax,8
mov bx,-3
call fracdisp
call newline
call fracdisp
call newline
mov ax,1
push ax
mov ax,3
push ax
mov ax,1
push ax
mov ax,5
push ax
mov bx,3
call frac_oper
call fracdisp
call newline
mov ax,1
push ax
mov ax,3
push ax
mov ax,2
push ax
mov ax,5
push ax
mov bx,0
call frac_oper
call fracdisp
call newline
mov ax,1
push ax
mov ax,3
push ax
mov ax,2
push ax
mov ax,5
push ax
mov bx,1
call frac_oper
call fracdisp
call newline

mov ax, 4C00h
int 21h

frac_oper:
push bp
mov bp,sp
push dx
and bx,3
shl bx,1
mov dx,frac_oper_table[bx]
jmp dx
frac_oper_end:
pop dx
pop bp
ret 8

frac_mul:
mov ax,[bp+8]
imul word ptr[bp+4]
mov bx,ax
mov ax,[bp+10]
imul word ptr[bp+6]
jmp frac_oper_end

frac_div:
mov ax,[bp+8]
imul word ptr[bp+6]
mov bx,ax
mov ax,[bp+10]
imul word ptr[bp+4]
jmp frac_oper_end

frac_add:
mov ax,[bp+10]
imul word ptr[bp+4]
mov bx,ax
mov ax,[bp+8]
imul word ptr[bp+6]
add bx,ax
mov ax,[bp+8]
imul word ptr[bp+4]
xchg ax,bx
jmp frac_oper_end

frac_sub:
mov ax,[bp+10]
imul word ptr[bp+4]
mov bx,ax
mov ax,[bp+8]
imul word ptr[bp+6]
sub bx,ax
mov ax,[bp+8]
imul word ptr[bp+4]
xchg ax,bx
jmp frac_oper_end

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

code ends
end start

