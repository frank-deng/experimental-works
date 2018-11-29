sysinfo.py
==========

A python3/qpython3 based tool for fetching the following system information:

* Boot time
* Overall CPU usage in percentage
* Per CPU usage in percentage for multi-core platform
* Memory usage in percentage
* CPU temperature in Celsius degree
* GPU temperature in Celsius degree (For Nvidia GPU only, using `nvidia-smi`)
* Battery Level (For Android QPython only)

Supported Platforms
-------------------

* Linux (Ubuntu/Debian)
* Android + QPython3

Command Line Usage
------------------

Synopsis:

	sysinfo

Command output:

	CPU Temperature: 45°C
	GPU Temperature: 47°C
	CPU Usage: 5.1%
	Memory Usage: 20.1%
	Boot Time: 2016-08-16T12:21:28

WebSocket Server
----------------

A [`ws4py`](https://pypi.python.org/pypi/ws4py) based WebSocket server, which pushes system information to each ws connections.

Synopsis:

	sysinfo-ws.py port [push_interval]

Web-based client inside `web-client` directory shows how to fetch system information via WebSocket from browser.

Received message is in JSON format, for example:

	{
	  "boot_time": "2016-08-16T12:21:28",
	  "cpu_usage": 0.1,
	  "mem_usage": 0.05,
	  "cpu_temp": 45,
	  "gpu_temp": 47,
	}

