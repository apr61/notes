---
title: Nmap
date: 03/06/2026
---

NMAP is a network discovery and security auditing tool.

### TCP scans:

- SYN Scan: -sS (root only)
- Connect Scan: -sT

### UDP scan

- -sU

### ICMP scan

- -sn or -sP

#### Example o/p

```sh
pradeep@pop-os:~/Learning/frontend/notes$ nmap -sT scanme.nmap.org
Starting Nmap 7.80 ( https://nmap.org ) at 2026-06-03 22:03 IST
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.28s latency).
Other addresses for scanme.nmap.org (not scanned): 2600:3c01::f03c:91ff:fe18:bb2f
Not shown: 996 closed ports
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
9929/tcp  open  nping-echo
31337/tcp open  Elite

Nmap done: 1 IP address (1 host up) scanned in 51.47 seconds
pradeep@pop-os:~/Learning/frontend/notes$ 
```

### Scan based on a port

We can scan for specific ports using `-p` option followed by port numbers.

```sh
namp -p port1,port2,port3,... ip/hostname
```

```sh
pradeep@pop-os:~/Learning/frontend/notes$ nmap -p 22,80,443,50005 scanme.nmap.org
Starting Nmap 7.80 ( https://nmap.org ) at 2026-06-03 22:07 IST
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.48s latency).
Other addresses for scanme.nmap.org (not scanned): 2600:3c01::f03c:91ff:fe18:bb2f

PORT      STATE  SERVICE
22/tcp    open   ssh
80/tcp    open   http
443/tcp   closed https
50005/tcp closed unknown

Nmap done: 1 IP address (1 host up) scanned in 2.02 seconds
pradeep@pop-os:~/Learning/frontend/notes$
```

We can use `-p-` option to scan all the ports. This option may take some while.

### Scan Version

```sh
namp -sV -p port1,port2 hostname
```

```sh
pradeep@pop-os:~/Learning/frontend/notes$ nmap -sV -p 22,80,443,50005 scanme.nmap.org
Starting Nmap 7.80 ( https://nmap.org ) at 2026-06-03 22:11 IST
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.32s latency).
Other addresses for scanme.nmap.org (not scanned): 2600:3c01::f03c:91ff:fe18:bb2f

PORT      STATE  SERVICE VERSION
22/tcp    open   ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
80/tcp    open   http    Apache httpd 2.4.7 ((Ubuntu))
443/tcp   closed https
50005/tcp closed unknown
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 14.00 seconds
```

### Ping scanning (entire Network)

```sh
nmap -sP 192.168.0.0/24
```

### Excluding an IP

```sh
nmap -sS 192.168.0.0/24 --exclude 192.168.0.10
```

### Saving the scanning report to a file

```sh
nmap -oN output.txt 192.168.0.1
```

### OS Detection

```sh
nmap -O 192.168.0.1
```

### Other resources

https://nmap.org/book/performance-timing-templates.html
 
-T paranoid|sneaky|polite|normal|aggressive|insane (Set a timing template)
These templates allow the user to specify how aggressive they wish to be, while leaving Nmap to pick the exact
timing values. The templates also make some minor speed adjustments for which fine-grained control options do
not currently exist.
 
### -A OS and service detection with faster execution

```sh
nmap -A -T aggressive cloudflare.com
```

## TCP/UDP port states

### OPEN

- There is an application that's listening on an OPEN port. We can communicate with that application.
- An OPEN port responds back to the source.
- We can list open ports using netstat command.

### CLOSED

- There is no application that's listening on a CLOSED port.
- A CLOSED port responds too, with ***TCP RESET*** for TCP traffic and with ***ICMP Port Unreachable*** for UDP traffic.
- The CLOSED ports can be useful for showing a host a up. This is also known as Host discovery and is part of OS detection.

### FILTERED/STEALTH

- A firewall is dropping any packet. The port can be OPEN or CLOSED on the host, but we can't communicate with it.
- A FILTERED port doesnot respond back.
