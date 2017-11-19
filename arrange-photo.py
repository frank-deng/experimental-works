#!/usr/bin/env python
#encoding=UTF-8

import os, sys, time, shutil, getopt;
from exifread import process_file;

def getCaptureDate(filepath):
    with open(filepath) as fp:
        exif_data = process_file(fp);
        exif_capture_date = exif_data.get('EXIF DateTimeOriginal');
        if (exif_capture_date and exif_capture_date.printable != '0000:00:00 00:00:00'):
            return time.strptime(exif_capture_date.printable, '%Y:%m:%d %H:%M:%S');
        else:
            return time.localtime(os.path.getmtime(filepath));

if __name__ == '__main__':
    HELP_INFO = '''A tool used to group photos into directories by capture date from EXIF data,
or modification date if no EXIF capture date.

Usage: %s -h|-y|-m|-d|-f DIR_FORMAT directory
    -h              Show this help information
    -y              Group photos by YEAR
    -m              Group photos by YEAR-MONTH
    -d              Group photos by YEAR-MONTH-DAY
    -f DIR_FORMAT   Group photos by custom date format used by time.strftime()
'''%sys.argv[0];

    dir_format = None;
    opts, args = getopt.getopt(sys.argv[1:], 'hymdf:');
    for option, value in opts:
        if (option == '-h'):
            pass;
        if (option == '-y'):
            dir_format = '%Y';
        elif (option == '-m'):
            dir_format = '%Y-%m';
        elif (option == '-d'):
            dir_format = '%Y-%m-%d';
        elif (option == '-f'):
            dir_format = value;

    if (len(args) < 1 or dir_format == None):
        sys.stderr.write(HELP_INFO);
        exit(1);

    src_dir = os.path.realpath(args[0]);
    for filename in os.listdir(src_dir):
        filepath = os.path.realpath(src_dir+os.sep+filename);
        if (os.path.isfile(filepath)):
            capture_date = getCaptureDate(filepath);
            dest_dir = os.path.realpath(src_dir+os.sep+time.strftime(dir_format, capture_date));
            try:
                if (not os.path.isdir(dest_dir)):
                    os.makedirs(dest_dir);
                shutil.move(filepath, dest_dir+os.sep);
            except Exception as e:
                print(str(e));

    exit(0);

