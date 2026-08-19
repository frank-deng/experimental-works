.model tiny
.8086
assume cs:code,ds:code,es:code,ss:code
code segment
org 100h
start:
mov cx,11187
xor ax,ax
mov di,offset map
rep stosw

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

mov ax,5
push ax
mov ax,1
push ax
mov ax,5
push ax
mov ax,5
push ax
mov ax,3
push ax
mov ax,1
push ax
mov ax,2
push ax
mov bp,sp
sub bp,4
call expr_abcssds
call fracdisp
call newline

mov ax,5
push ax
mov ax,6
push ax
mov ax,7
push ax
mov ax,8
push ax
mov ax,15
call enum_perm_oper

mov ax, 4C00h
int 21h

enum_perm_oper:
push bp
mov bp,sp
push ax
push bx
push cx
push dx
push si
push di
;push ax ;idx
xor bx,bx
loop_perm:
mov cx,64
loop_oper:
xor dx,dx
mov dl,byte ptr[bx+perm]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
call int16disp
mov dl,byte ptr[bx+perm+1]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
call int16disp
mov dl,byte ptr[bx+perm+2]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
call int16disp
mov dl,byte ptr[bx+perm+3]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
call int16disp

mov dx,cx
dec dx
and dx,03fh
mov ax,dx
and ax,3
call int16disp
shr dx,1
shr dx,1
mov ax,dx
and ax,3
call int16disp
shr dx,1
shr dx,1
mov ax,dx
call int16disp
call newline
loop loop_oper

add bx,4
cmp bx,96
jge loop_perm_end
jmp loop_perm
loop_perm_end:
pop di
pop si
pop dx
pop cx
pop bx
pop ax
pop bp
ret


;idx=+18 a=+16 b=+14 c=+12 d=+10 s0=+8 s1=+6 s2=+4
enum_expr:
push bp
mov bp,sp
push ax
push bx
push cx
push dx
push si
push di
call expr_abcdsss
call write_res
call expr_abcsdss
call write_res
call expr_abcssds
call write_res
call expr_abscsds
call write_res
call expr_abscdss
call write_res
pop di
pop si
pop dx
pop cx
pop bx
pop ax
pop bp
ret 16

write_res:
call fracdisp
test bx,bx
jz write_res_end
cwd
idiv bx
test dx,dx
jnz write_res_end
cmp ax,1
jl write_res_end
cmp ax,99
jg write_res_end
call int16disp
mov dx,226
mul dx
mov di,ax
mov dx,[bp+18]
mov bx,dx
mov cl,3
shl bx,cl
and bl,0feh
mov cl,dl
and cl,15
mov ax,08000h
ror ax,cl
or word ptr[bx+di+map],ax
write_res_end:
call newline
ret

expr_abcdsss:
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
ret

expr_abcsdss:
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
ret

expr_abcssds:
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
ret

expr_abscsds:
mov ax,word ptr[bp+16]
mov bx,1
mov cx,word ptr[bp+14]
mov dx,1
mov si,word ptr[bp+8]
call frac_oper
mov cx,word ptr[bp+12]
mov dx,1
mov si,word ptr[bp+6]
call frac_oper
mov cx,word ptr[bp+10]
mov dx,1
mov si,word ptr[bp+4]
call frac_oper
ret

expr_abscdss:
mov ax,word ptr[bp+12]
mov bx,1
mov cx,word ptr[bp+10]
mov dx,1
mov si,word ptr[bp+6]
call frac_oper
push ax
push bx
mov ax,word ptr[bp+16]
mov bx,1
mov cx,word ptr[bp+14]
mov dx,1
mov si,word ptr[bp+8]
call frac_oper
pop dx
pop cx
mov si,word ptr[bp+4]
call frac_oper
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
xchg ax,bx
imul dx
xchg ax,bx
imul cx
ret

frac_div:
imul dx
xchg ax,bx
imul cx
xchg ax,bx
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
sub sp,8
push ax
push bx
push cx
push dx
push si
push di
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
pop di
pop si
pop dx
pop cx
pop bx
pop ax
mov sp,bp
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
fname db "24STAT.CSV",0,0
map:

code ends
end start

