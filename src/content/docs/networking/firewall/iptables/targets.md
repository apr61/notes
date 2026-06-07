---
title: IpTables Targets
date: 01/06/2026
---

A TARGET is the action that is triggered when a packet meets the matching criteria of a rule.

A Target can be:
1. Terminating (Example: ACCEPT, DROP)
2. Non-terminating (Example: LOG, TEE)

- A non-terminating target can hit multiple times before hitting a terminating target.
- Terminating target perform an action which terminates the evaluation within the chain. The packet matched by the rule will not continuting traversing any rule in the chain or other chains in the same table.

## Targets

### ACCEPT

- ACCEPT is an terminating target.

### DROP

- DROP is a terminating target
- DROP denies the packet and doesnot send any packet to the source.

### REJECT

- REJECT is a terminating target.
- Like DROP it denies the packet but also sends back a reply packet to the source.
- By default, it sends back an **ICMP Port unreachable** packet.
- It's possible to change the response using the `--reject-with` option.
- Sometimes it is more efficient to REJECT than DROPPING the packet.

#### Example

```sh
iptables -i FORWARD -p udp --dport 69 -j REJECT --reject-with icmp-port-unreachable
```

### REJECT vs --reject-with vs DROP

We will be dropping the SSH packets from a specific ip using REJECT vs --reject-with vs DROP.
And check the behaviour.

SSH will be running in linux-1 ()
Port scanning will be run in linux-2 (192.168.122.1)

#### REJECT

```sh
iptables -A INPUT -p tcp --dport 22 -s 192.168.122.1 -j REJECT
```

start the TCPDUMP and perform SSH from linux-2

##### nmap

```sh
pradeep@pop-os:~/Learning/frontend/notes$ nmap -p 22 192.168.122.120
Starting Nmap 7.80 ( https://nmap.org ) at 2026-06-03 22:41 IST
Nmap scan report for 192.168.122.120
Host is up (0.00036s latency).

PORT   STATE  SERVICE
22/tcp closed ssh

Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds
```

##### tcpdump

```sh
root@fedora:/home/pradeep# tcpdump host 192.168.122.1 -n
dropped privs to tcpdump
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on enp1s0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
# Linux-2 sent a --syn packet to linux-1
22:41:38.836762 IP 192.168.122.1.56696 > 192.168.122.120.ssh: Flags [S], seq 2430441461, win 64240, options [mss 1460,sackOK,TS val 526629449 ecr 0,nop,wscale 10], length 0

# linux-2 sent a ICMP port ssh unreachable
22:41:38.836818 IP 192.168.122.120 > 192.168.122.1: ICMP 192.168.122.120 tcp port ssh unreachable, length 68
```

#### --reject-with

```sh
iptables -I INPUT -p tcp --dport 22 -s 192.168.122.1 -j REJECT --reject-with tcp-reset
```

##### namp

```sh
pradeep@pop-os:~/Learning/frontend/notes$ nmap -p 22 192.168.122.120
Starting Nmap 7.80 ( https://nmap.org ) at 2026-06-03 22:50 IST
Nmap scan report for 192.168.122.120
Host is up (0.00036s latency).

PORT   STATE  SERVICE
22/tcp closed ssh

Nmap done: 1 IP address (1 host up) scanned in 0.04 seconds
pradeep@pop-os:~/Learning/frontend/notes$ 
```

##### tcpdump

```sh
# Linux-2 sent a --syn packet to linux-1
22:50:03.301234 IP 192.168.122.1.52072 > 192.168.122.120.ssh: Flags [S], seq 2092105226, win 64240, options [mss 1460,sackOK,TS val 527133929 ecr 0,nop,wscale 10], length 0

# Linux-1 sent an tcp-reset packet to linux-2
22:50:03.301312 IP 192.168.122.120.ssh > 192.168.122.1.52072: Flags [R.], seq 0, ack 2092105227, win 0, length 0
```

#### DROP

```sh
iptables -I INPUT -p tcp --dport 22 -s 192.168.122.1 -j DROP
```

##### nmap

```sh
pradeep@pop-os:~/Learning/frontend/notes$ nmap -p 22 192.168.122.120
Starting Nmap 7.80 ( https://nmap.org ) at 2026-06-03 22:53 IST
Nmap scan report for 192.168.122.120
Host is up (0.00052s latency).

PORT   STATE    SERVICE
22/tcp filtered ssh # NOTICE, how port scan is showing filtered here.

Nmap done: 1 IP address (1 host up) scanned in 0.25 seconds
```

##### tcpdump

```sh
# Linux-2 sent two --syn packets and linux-1 dropped both the packets and no response was sent back.
# Eventually linux-2 stopped sending altogether.
22:53:17.057574 IP 192.168.122.1.38646 > 192.168.122.120.ssh: Flags [S], seq 4108742192, win 64240, options [mss 1460,sackOK,TS val 527327687 ecr 0,nop,wscale 10], length 0
22:53:17.157842 IP 192.168.122.1.38660 > 192.168.122.120.ssh: Flags [S], seq 1822025829, win 64240, options [mss 1460,sackOK,TS val 527327788 ecr 0,nop,wscale 10], length 
```

### LOG

- LOG is a non-terminating target.
- It logs detailed information about packet headers.
- Logs can be read with dmesg or from syslogd daemon.
- LOG is used instead of DROP in the debugging phase.
- ULOG has MySQL support (extensive logging)

#### LOG options

1. --log-prefix
2. --log-level

#### Example

```sh
iptables -A INPUT -p tcp --dport 22 --syn -j LOG --log-prefix="incomming ssh:" --log-level info
```

The incomming packets of SSH syn will be logged:

```sh
root@fedora:/home/pradeep# dmesg -w | grep "incomming ssh:"
[ 2223.910781] incomming ssh:IN=enp1s0 OUT= MAC=52:54:00:4a:02:39:52:54:00:42:db:cd:08:00 SRC=192.168.122.1 DST=192.168.122.120 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=62521 DF PROTO=TCP SPT=40046 DPT=22 WINDOW=64240 RES=0x00 SYN URGP=0 
[ 2224.010789] incomming ssh:IN=enp1s0 OUT= MAC=52:54:00:4a:02:39:52:54:00:42:db:cd:08:00 SRC=192.168.122.1 DST=192.168.122.120 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=19849 DF PROTO=TCP SPT=40052 DPT=22 WINDOW=64240 RES=0x00 SYN URGP=0 
```

### TEE

- The TEE target will clone a packet and redirect this clone to another machine on the local subnet.
- It is used for traffic mirroring.

#### Example:

```sh
iptables -A FORWARD -i eth0 -o eth1 -p tcp -d 80.0.0.1 -j TEE --gateway 10.0.0.10
```

#### Scenario - 1

Let's have a scenario, where we have 3 linux machines.
ICMP packets coming from linux-1 to linux-2 needs to be shared to linux-3.

linux - 1 (192.168.122.1)
linux - 2 (192.168.122.120)
linux - 3 (192.168.122.112)

Step -1 : In linux-2 will add below rule to mirror any incoming traffic from linux-3.

```sh
iptables -A INPUT -p icmp --icmp-type echo-request -j TEE --gateway 192.168.122.112
```

We add below rule to OUTPUT chain to mirror echo-reply.

```sh
iptables -A OUTPUT -p icmp --icmp-type echo-reply -j TEE --gateway 192.168.122.112
```

Step - 2: In linux-3, capture TCPdump.

Step - 3: From linux-1, make ping to linux-2.

##### ping from linux-1 to linux-2

```sh
pradeep@pop-os:~/Learning/frontend/notes$ ping 192.168.122.120
PING 192.168.122.120 (192.168.122.120) 56(84) bytes of data.
64 bytes from 192.168.122.120: icmp_seq=1 ttl=64 time=0.310 ms
64 bytes from 192.168.122.120: icmp_seq=2 ttl=64 time=0.290 ms
64 bytes from 192.168.122.120: icmp_seq=3 ttl=64 time=0.531 ms
64 bytes from 192.168.122.120: icmp_seq=4 ttl=64 time=0.433 ms
64 bytes from 192.168.122.120: icmp_seq=5 ttl=64 time=0.397 ms
64 bytes from 192.168.122.120: icmp_seq=6 ttl=64 time=0.265 ms
```

##### tcpdump in linux-3

```sh
22:45:18.819079 IP 192.168.122.1 > 192.168.122.120: ICMP echo request, id 1, seq 1, length 64
22:45:19.873062 IP 192.168.122.1 > 192.168.122.120: ICMP echo request, id 1, seq 2, length 64
22:45:20.898344 IP 192.168.122.1 > 192.168.122.120: ICMP echo request, id 1, seq 3, length 64
22:45:21.921221 IP 192.168.122.1 > 192.168.122.120: ICMP echo request, id 1, seq 4, length 64
22:45:22.945176 IP 192.168.122.1 > 192.168.122.120: ICMP echo request, id 1, seq 5, length 64
22:45:23.968995 IP 192.168.122.1 > 192.168.122.120: ICMP echo request, id 1, seq 6, length 64
```

##### iptables o/p in linux-2

```sh
root@fedora:/home/pradeep# iptables -nvL
Chain INPUT (policy ACCEPT 7 packets, 577 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    6   504 TEE        icmp --  *      *       0.0.0.0/0            0.0.0.0/0            icmptype 8 TEE gw:192.168.122.112

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
```

### REDIRECT

- Used to redirect packets from one port to another on the same machine.
- The REDIRECT target is extremely good to use for transparent proxying, where the LAN hosts do not know about the proxy at all.
- REDIRECT target is only valid within the PREROUTING and OUTPUT chains of the NAT table.

#### Example

```sh
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080
```

## ping

- ICMP stands for Internet Control Message Protocol. 
- Ping works on ICMP protocol. 
- Source sends ICMP echo-request and destination replies with ICMP echo-reply.



