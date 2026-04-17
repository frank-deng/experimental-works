function! s:GetLangFromExt(ext)
    let map = {
        \ 'py': 'python',
        \ 'js': 'javascript',
        \ 'ts': 'typescript',
        \ 'java': 'java',
        \ 'c': 'c',
        \ 'cpp': 'cpp',
        \ 'go': 'go',
        \ 'rs': 'rust',
        \ 'rb': 'ruby',
        \ 'php': 'php',
        \ 'html': 'html',
        \ 'css': 'css',
        \ 'sh': 'bash',
        \ 'vim': 'vim',
        \ 'txt': 'text'
        \ }
    return get(map, a:ext, '')
endfunction

function! InsertFileContent(file, use_absolute)
    let raw_path = expand(a:file)
    let filepath = fnamemodify(raw_path, ':p')
    if !filereadable(filepath)
        echoerr "文件不可读: " . filepath
        return
    endif

    if a:use_absolute
        let display_path = filepath
    else
        let display_path = raw_path
    endif

    let ext = fnamemodify(filepath, ':e')
    let lang = s:GetLangFromExt(ext)
    let lines = readfile(filepath)

    let insert_lines = [display_path]
    call add(insert_lines, '```' . lang)
    call extend(insert_lines, lines)
    call add(insert_lines, '```')

    let cur_line = line('.')
    call append(cur_line, insert_lines)

    let total_inserted = len(insert_lines)
    call cursor(cur_line + total_inserted + 1, 1)
endfunction

" 定义两个命令：默认相对路径，绝对路径用 InsertFile!
command! -nargs=1 -complete=file InsertFile  call InsertFileContent(<q-args>, 0)
command! -nargs=1 -complete=file InsertFileA call InsertFileContent(<q-args>, 1)

