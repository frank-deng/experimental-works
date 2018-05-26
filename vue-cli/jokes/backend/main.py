#!/usr/bin/env python3
#encoding=UTF-8

import argparse;
parser = argparse.ArgumentParser();
parser.add_argument(
    '--host',
    '-H',
    help='Specify binding host for the server.',
    default=''
);
parser.add_argument(
    '--port',
    '-p',
    help='Specify port for the server.',
    type=int,
    default=8080
);
args = parser.parse_args();

from bottle import route, run, view, template, request, response, redirect;
import models, urllib;

from multiprocessing.pool import ThreadPool;
@route('/')
def index():
    response.set_header('Access-Control-Allow-Origin', '*');
    return models.fetchJokes();

run(host=args.host, port=args.port);

