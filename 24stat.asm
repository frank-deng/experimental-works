org 100h

frac_oper:
push bp
mov bp,sp
push dx
and bx,3
shl bx,1
mov dx,frac_oper_table[bx]
jmp dx
frac_oper_table:
dw frac_add,frac_sub,frac_mul,frac_div
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
imul word ptr[bp+8]
sub bx,ax
mov ax,[bp+6]
imul word ptr[bp+10]
xchg ax,bx
jmp frac_oper_end

