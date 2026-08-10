.model tiny
.8086
assume cs:code,ds:code,es:code,ss:code
code segment
org 100h
start:
mov ax,-12345
lea di,num_str
call int162str

mov ah,40h
mov bx,1
xor ch,ch
mov cl,byte ptr [num_str]
lea dx,num_str
inc dx
int 21h

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
mov ax,[bp+6]
imul word ptr[bp+10]
mov bx,ax
mov ax,[bp+4]
imul word ptr[bp+8]
jmp frac_oper_end

frac_div:
mov ax,[bp+6]
imul word ptr[bp+8]
mov bx,ax
mov ax,[bp+4]
imul word ptr[bp+10]
jmp frac_oper_end

frac_add:
mov ax,[bp+4]
imul word ptr[bp+10]
mov bx,ax
mov ax,[bp+6]
imul word ptr[bp+8]
add bx,ax
mov ax,[bp+6]
imul word ptr[bp+10]
xchg ax,bx
jmp frac_oper_end

frac_sub:
mov ax,[bp+4]
imul word ptr[bp+10]
mov bx,ax
mov ax,[bp+6]
imul word ptr[bp+8]
sub bx,ax
mov ax,[bp+6]
imul word ptr[bp+10]
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

frac_oper_table dw frac_add,frac_sub,frac_mul,frac_div
num_str db 0,0,0,0,0,0,0,0

code ends
end start

