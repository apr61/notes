---
title: Basic matches
date: 22/05/2026
---

### Filter by IP or Netword Address

1. Match by source IP or Network Address

__Match:__ `-s IP`, `--source IP`

The IP can be an actual ip address such as 192.10.0.20 or Domain Name such as www.ubuntu.com

__Example:__ 
```sh
iptables -A INPUT -s 192.10.0.20 -j DROP
```

2. Match by destination IP or Network Address

__Match:__ `-d IP`, `--destination IP`

__Example:__ 
```sh
iptables -A INPUT -d www.linux.com -j DROP
iptables -A FORWARD -d 10.20.2.1 -j ACCEPT
```

3. Using the `-d 0/0` is the same as not specify any destination address.

```sh
iptables -A OUTPUT -p tcp --dport 443 -d 0/0 -j ACCEPT
```
is the same as 
```sh
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
```

### Filter by IP Range and Address type
1. Match by IP range

__Match:__ `-m iprange --src-range ip_start-ip_end`
            `-m iprange --dst-range ip_start-ip_end`

__Example:__
```sh
iptables -A INPUT -m iprange --src-range 10.0.0.10-10.0.0.29 -p tcp --dport 25 -j DROP

iptables -A OUTPUT -m iprange --dst-range 10.0.0.10-10.0.0.29 -p tcp --dport 25 -j DROP

iptables -A OUTPUT -m iprange --dst-range 10.0.0.10-10.0.0.29 -p icmp -j DROP
```

2. Match by Address type

__Match:__ `-m addrtype --src-type UNICAST,MULTICAST,BROADCAST`
         `-m addrtype --dst-type UNICAST,MULTICAST,BROADCAST`

__Example:__
```sh
iptables -A OUTPUT -m addrtype --dst-type MULTICAST -j DROP
```

Available address types

```sh
Address type match options:
 [!] --src-type type[,...]      Match source address type
 [!] --dst-type type[,...]      Match destination address type
     --limit-iface-in           Match only on the packet's incoming device
     --limit-iface-out          Match only on the packet's outgoing device

Valid types:           
                                UNSPEC
                                UNICAST
                                LOCAL
                                BROADCAST
                                ANYCAST
                                MULTICAST
                                BLACKHOLE
                                UNREACHABLE
                                PROHIBIT
                                THROW
                                NAT
                                XRESOLVE
```

### Filter by Port

1. Match by a single port

   __Match:__ `-p tcp --dport port`, `-p udp --sport port`

   __Example:__
   ```sh
   iptables -A INPUT -p tcp --dport 22 -j DROP
   ```
__Note__: It is mandotory to specify the -p protocol option for Port of tcp and udp protocol. Other protocols such as ICMP donot use ports at all.

2. Match by multiple ports

   __Match:__ `-m multiport --sports | --dports port1,port2,...`

   __Example:__
      ```sh 
      iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -j ACCEPT
      ```


#### Exercise
Iptables rules to allow only one ip source

```sh
#!/bin/bash

# A firewall rules to accept SSH traffic from one source IP

# Flush all the rules in filter table
iptables -F

# Rule to accept traffic from only one IP
iptables -A INPUT -p tcp --dport 22 -s 10.10.10.2 -j ACCEPT

# Rule to drop all other ssh traffic
iptables -A INPUT -p tcp --dport 22 -s 0/0 -j DROP
```

### Filter by Protcol
The only protocols that use ports are TCP and UDP.

Protocols such as ICMP, GRE, OSPF or EIGRP don't use ports.

The scope of iptables is at Transport layer and below.

To get the list of available protocols

```sh
cat /etc/protocols
```
#### Example
Only allow TCP and UDP protocols traffic.

```sh
#!/bin/bash

# A firewall rules to accept only TCP and UDP traffic

# Flush all the rules in filter table
iptables -F

# Set default policy for INPUT and OUTPUT chain
iptables -P INPUT DROP
iptables -P OUTPUT DROP

# Allow loopback interface traffic, in both input and output interfaces
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# rules to allow traffic only for TCP and UDP protocols
iptables -A INPUT -p tcp -j ACCEPT
iptables -A OUTPUT -p tcp -j ACCEPT

iptables -A INPUT -p udp -j ACCEPT
iptables -A OUTPUT -p udp -j ACCEPT
```

Ping is not allowed because of ICMP

```sh
root@ip-172-31-15-101:/home/ubuntu# ping www.google.com
PING www.google.com (142.251.151.119) 56(84) bytes of data.
^C
--- www.google.com ping statistics ---
9 packets transmitted, 0 received, 100% packet loss, time 8199ms

root@ip-172-31-15-101:/home/ubuntu# 
```

DNS query is allowed

```sh
root@ip-172-31-15-101:/home/ubuntu# dig www.google.com

; <<>> DiG 9.20.18-1ubuntu2-Ubuntu <<>> www.google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 30376
;; flags: qr rd ra; QUERY: 1, ANSWER: 8, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;www.google.com.                        IN      A

;; ANSWER SECTION:
www.google.com.         86      IN      A       142.251.156.119
www.google.com.         86      IN      A       142.251.155.119
www.google.com.         86      IN      A       142.251.157.119
www.google.com.         86      IN      A       142.251.151.119
www.google.com.         86      IN      A       142.251.154.119
www.google.com.         86      IN      A       142.251.152.119
www.google.com.         86      IN      A       142.251.153.119
www.google.com.         86      IN      A       142.251.150.119

;; Query time: 0 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Sat May 16 10:28:36 UTC 2026
;; MSG SIZE  rcvd: 171
root@ip-172-31-15-101:/home/ubuntu# 
```

Iptables o/p
```sh
root@ip-172-31-15-101:/home/ubuntu# iptables -nvL
Chain INPUT (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    6   918 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
  177 11677 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           
    6   938 ACCEPT     udp  --  *      *       0.0.0.0/0            0.0.0.0/0           

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy DROP 9 packets, 756 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    6   918 ACCEPT     all  --  *      lo      0.0.0.0/0            0.0.0.0/0           
  109 10945 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           
    6   586 ACCEPT     udp  --  *      *       0.0.0.0/0            0.0.0.0/0           
root@ip-172-31-15-101:/home/ubuntu# 
```

### Filter by interface

1. Match by incoming interface

   __Match:__ `-i incomming_interface`

   __Available only for__: INPUT, FORWARD and PREROUTING chains

   __Example:__
```sh
iptables -A INPUT -i wlan0 -j ACCEPT
iptables -A INPUT -i wlan+ -j ACCEPT # Will match all the interfaces starting with wlan
```

We can use the interface_prefix`+` to match all the interfaces.

2. Match by outgoing interface

   __Match:__ `-o outgoing_interface`

   __Available only for__: OUTPUT, FORWARD and POSTROUTING chains

   __Example:__
```sh
iptables -A OUTPUT -o enp8s0 ACCEPT
```

>__Note__: It's good practice to permit traffic on the loopback interface (lo)

`Loopback interfaces` - This is a special interface that is used by one's computer to communicate with itself. It is mainly used to diagnose/troubleshoot and to connect to servers running on the local machine.

#### Examples

```sh
#!/bin/bash
iptables -F

# Allow loopback interface traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Dropping ssh traffic that's coming on eth0 interface
iptables -A INPUT -p tcp --dport 22 -i eth0 -j DROP

# Allowing ssh traffic that's coming on eth1 interface
iptables -A INPUT -p tcp --dport 22 -i eth1 -j ACCEPT

# Allow outgoing https traffic via eth1 interface
iptables -A OUTPUT -p tcp --dport 443 -o eth1 -j ACCEPT
```

```sh
Chain INPUT (policy ACCEPT 661 packets, 203K bytes)
 pkts bytes target     prot opt in     out     source               destination         
    6   799 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    0     0 DROP       tcp  --  eth0   *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22
    0     0 ACCEPT     tcp  --  eth1   *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 537 packets, 97837 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    6   799 ACCEPT     all  --  *      lo      0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     tcp  --  *      eth1    0.0.0.0/0            0.0.0.0/0            tcp dpt:443
```

### Negating matches
We can use negate on a rule using the `!` mark.

#### Example 1
Allow http traffic to a specific service only from a given ip address

Http will be allowed only for ip => 15.206.164.160. For other sources, packets will be dropped.
```sh
iptables -A INPUT ! -s 15.206.164.160 -p tcp --dport 80 -j DROP
```

```sh
root@ip-172-31-15-101:/home/ubuntu# iptables -nvL
Chain INPUT (policy ACCEPT 1352 packets, 272K bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       tcp  --  *      *      !15.206.164.160       0.0.0.0/0            tcp dpt:80

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 1108 packets, 192K bytes)
 pkts bytes target     prot opt in     out     source               destination         

root@ip-172-31-15-101:/home/ubuntu# iptables -nvL
Chain INPUT (policy ACCEPT 1377 packets, 274K bytes)
 pkts bytes target     prot opt in     out     source               destination         
   15   860 DROP       tcp  --  *      *      !15.206.164.160       0.0.0.0/0            tcp dpt:80

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 1128 packets, 195K bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@ip-172-31-15-101:/home/ubuntu# 
```

#### Example 2
```sh
#!/bin/bash

iptables -F

# dropping all incoming http traffic and accepting from one source
iptables -A INPUT ! -s 10.0.0.1 -p tcp --dport 80 -j DROP

# Dropping all outgoing https traffic excepting to www.linux.com
iptables -A OUTPUT ! -d www.linux.com -p tcp --dport 443 -j DROP

# Dropping all communication excepting that with default gateway
iptables -A INPUT -m mac ! --mac-source b4:6d:83:77:85:77:85:f4 -j DROP
iptables -P INPUT ACCEPT
```

```sh
root@ip-172-31-15-101:/home/ubuntu# iptables -nvL
Chain INPUT (policy ACCEPT 4563 packets, 914K bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       tcp  --  *      *      !10.0.0.1             0.0.0.0/0            tcp dpt:80

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 3363 packets, 807K bytes)
 pkts bytes target     prot opt in     out     source               destination         
   58  4047 DROP       tcp  --  *      *       0.0.0.0/0           !23.185.0.3           tcp dpt:443
root@ip-172-31-15-101:/home/ubuntu# 
```

### Match by TCP flags

__Match:__

   `--syn`: match if the syn flag is set

   `--tcp-flags mask comp` : Match when the TCP flags are set as specified.

   1. The first argument`mask` is the flags which we should examine, written as comma-seperated list.
   2. The second argument `comp` is a comma-separated list of flags which we must set.

__Example:__
```sh
iptables -A INPUT -i wlan0 -p tcp --syn -s 10.0.0.1 -j ACCEPT
```

#### TCP Flags are:

|TCP FLAG| Description|
|---|---|
|SYN|synchronize|
|ACK|acknowledgement|
|FIN|finalize|
|RST|reset|
|URG|urgent|
|PSH|push|
|ALL|All TCP flags are set|
|NONE|No TCP flag is set|

#### Example 1

Drop all packets which contains `--syn` flag

```sh
iptables -A INPUT -p tcp --syn --dport 80 -j DROP
```

#### Example 2
Logging output traffic that has syn and ack flag set

# TODO: check below command working
```sh
iptables -A OUTPUT -p tcp --tcp-flags syn,ack,rst,fin syn,ack -j LOG
```


## NMAP

### Difference between filtered, open and closed states when nmap is performed on a ip.

**open** - Traffic is open. Any person can access the resource available at this port.

**filtered** - An filtered port is an open port, but there is an filrewall that is dropping packets to the port. And we are not receving packets as response when sent.

**closed** - There is no application that is listening on the port. If we send a tcp packet on a closed port, we receive a RST flag set TCP packet. This indicates that the port is closed.
