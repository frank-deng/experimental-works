#!/usr/bin/env python3
#encoding=UTF-8

from distutils.core import setup
setup(
    name='sysinfo.py',
    version='0.4',
    author = "frank-deng",
    description = "A python3 based tool for fetching system information.",
    license = "MIT",
    keywords = "system information cpu gpu temperature usage memory usage",
    url = "https://github.com/frank-deng/sysinfo.py",  

    platforms = ['Linux', 'Android QPython'],
    package_dir = {'sysinfo':'.'},
    py_modules = ['sysinfo'],
    scripts = ['sysinfo', 'sysinfo-ws.py']
);

