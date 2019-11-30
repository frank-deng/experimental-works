#!/bin/bash

ulimit -n 204800
ab -c 5000 -n 20000 'http://localhost:8090/'

