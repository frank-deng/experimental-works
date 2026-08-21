.model tiny
.8086
assume cs:code,ds:code,es:code,ss:code
code segment
org 100h
start:
mov cx,12800
xor ax,ax
mov di,offset map
rep stosw

call enum_nums
call get_res

mov ax, 4C00h
int 21h

enum_nums:
push bp
mov bp,sp
push ax
push bx
push cx
push dx
push si
push di
xor di,di
call update_progress
mov ax,1
loop_nums0:
mov bx,ax
loop_nums1:
mov cx,bx
loop_nums2:
mov dx,cx
loop_nums3:
push ax
push bx
push cx
push dx
xchg ax,di
call enum_perm_oper
xchg ax,di
inc di
call update_progress
inc dx
cmp dx,13
jle loop_nums3
inc cx
cmp cx,13
jle loop_nums2
inc bx
cmp bx,13
jle loop_nums1
inc ax
cmp ax,13
jle loop_nums0
pop di
pop si
pop dx
pop cx
pop bx
pop ax
pop bp
ret

update_progress:
push bp
mov bp,sp
push ax
push bx
push cx
push dx
push si
push di
mov ax,di
call int16disp
mov ah,02h
mov dl,0dh
int 21h
pop di
pop si
pop dx
pop cx
pop bx
pop ax
mov sp,bp
pop bp
ret

enum_perm_oper:
push bp
mov bp,sp
push ax
push bx
push cx
push dx
push si
push di
xor bx,bx
loop_perm:
mov cx,64
loop_oper:
push [bp-2]
xor dx,dx
mov dl,byte ptr[bx+perm]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
push ax
mov dl,byte ptr[bx+perm+1]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
push ax
mov dl,byte ptr[bx+perm+2]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
push ax
mov dl,byte ptr[bx+perm+3]
mov si,dx
shl si,1
mov ax,word ptr [bp+si+4]
push ax

mov dx,cx
dec dx
and dx,03fh
mov ax,dx
and ax,3
push ax
shr dx,1
shr dx,1
mov ax,dx
and ax,3
push ax
shr dx,1
shr dx,1
mov ax,dx
push ax
call enum_expr
loop loop_oper

add bx,4
cmp bx,96
jl loop_perm
pop di
pop si
pop dx
pop cx
pop bx
pop ax
pop bp
ret 8

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
mov sp,bp
pop bp
ret 16

write_res:
test bx,bx
jz write_res_end
cwd
idiv bx
test dx,dx
jnz write_res_end
cmp ax,0
jl write_res_end
cmp ax,99
jg write_res_end
mov bh,al
mov ax,[bp+18]
mov cl,al
and cl,15
shr ax,1
shr ax,1
shr ax,1
mov bl,al
and bl,0feh
mov ax,08000h
ror ax,cl
or word ptr[bx+map],ax
write_res_end:
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
push dx
push si
push di
xor cx,cx
mov bx,10
mov si,di
or ax,ax
jns int162str_div_loop
neg ax
mov byte ptr es:[di],'-'
inc di
int162str_div_loop:
cwd
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
mov cx,di
sub cx,si
pop di
pop si
pop dx
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
lea di,[bp-8]
call int162str
mov ah,40h
mov bx,1
mov dx,di
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

disp_space:
push ax
push dx
mov ah,02h
mov dl,' '
int 21h
pop dx
pop ax
ret

get_res:
xor bx,bx
loop_goal:
xor ah,ah
mov al,bh
call int16disp
mov ah,02h
mov dl,','
int 21h
mov cx,114
xor ax,ax
xor bl,bl
loop_map:
mov dx,[bx+map]
inc bl
inc bl
loop_cnt:
test dx,dx
jz loop_cnt_end
inc ax
mov si,dx
dec dx
and dx,si
jmp loop_cnt
loop_cnt_end:
loop loop_map
call int16disp
call newline
inc bh
cmp bh,99
jle loop_goal
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

