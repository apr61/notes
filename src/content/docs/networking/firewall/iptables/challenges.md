---
title: Challenges
date: 26/05/2026
---


## Challenges - 1 (Basic Matches)

### Challenge #1

Write the iptables rules that drop all incoming packets from 100.0.0.1 and 1.2.3.4 and all outgoing packets to 80.0.0.1

These will be the first rules in the chains.

#### Solution #1
```sh
iptables -I INPUT -s 100.0.0.1 -j DROP
iptables -I INPUT -s 1.2.3.4 -j DROP

iptables -I OUTPUT -d 80.0.0.1 -j DROP
```

### Chanllenge #2
Write the iptables rules that drop all outgoing generated packets of type tcp (port 80 and 443) to www.linuxquestions.org

#### Solution
```sh
iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -d www.linuxquestions.org -j DROP
```

### Challenge #3
Write the iptables rules that drop all outgoing packets of type tcp (port 80 and 443) to www.linuxquestions.org

The Linux machine is the router.

#### Solution
```sh
iptables -A FORWARD -p tcp --dport 80 -d www.linuxquestions.org -j DROP
iptables -A FORWARD -p tcp --dport 443 -d www.linuxquestions.org -j DROP
```

### Challenge #4
Write an iptables rule that drops all incoming packets from network 27.103.0.0 255.255.0.0

This will be the first rule in the chain.

#### Solution
```sh
iptables -I INPUT -s 27.103.0.0/16 -j DROP
```

### Challenge #5
The DNS Server of your LAN is set to 8.8.8.8. You don't want to allow the users of the LAN to change the DNS server.

Write an iptables rule in order to drop all UDP packets to port 53 (DNS) if they are destined to another IP address (not to 8.8.8.8). The Linux Machine is the Router

#### Solution
```sh
iptables -A FORWARD -p udp --dport 53 ! -d 8.8.8.8 -j DROP
```

### Challenge #6
Write the iptables rules that allow all traffic of the loopback (lo) interface.

#### Solution
```sh
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
```

### Challenge #7
Your Linux Machine is the router. The internal interface is called eth0 and the external interface is called eth1.

Write the iptables rules that allow establishing incoming ssh (tcp/22) connections only from the LAN.

```sh
# The rule oly tells, what to reject.
# iptables -A FORWARD -p tcp --dport 22 ! -i eth0 -j DROP

iptables -A FORWARD -p tcp --dport 22 -i eth0 -j ACCEPT
iptables -A FORWARD -p tcp --dport 22 -i eth1 -j DROP
```

## Challenges - 2 (Advanced Matches)

### Challenge #1

Create a firewall script for your Laptop what runs Linux. All outgoing traffic is allowed but only the return incoming traffic is permitted. No services are running on the laptop. 

#### Solution

```sh
#!/bin/bash

iptables -F

iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -m state --state INVALID -j DROP

iptables -A OUTPUT -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT

iptables -P INPUT DROP
iptables -P OUTPUT DROP

```

### Challenge #2
Consider Challenge #1. Make sure that you also:

- allow the loopback interface traffic (lo)

- drop invalid packets

- flush the firewall at the beginning of the script 

```sh
iptables -F

iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -m state --state INVALID -j DROP

iptables -A OUTPUT -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state INVALID -j DROP


iptables -P INPUT DROP
iptables -P OUTPUT DROP

```

### Challenge #3

Consider Challenge #2.

You start the SSH Daemon on your laptop and want to allow incoming SSH connections (tcp/22) only from your work (IP address: 100.0.0.1).

Add the appropriate iptables rule.

```sh
iptables -F

iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -m state --state INVALID -j DROP

iptables -A OUTPUT -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state INVALID -j DROP

# Rule to allow SSH from a specific ip
iptables -A INPUT -p tcp --dport 22 --syn -s 192.168.122.1 -j ACCEPT

iptables -P INPUT DROP
iptables -P OUTPUT DROP
```

### Challenge #4

The MAC Address of the LAN Router is b4:6d:83:77:85:f5

Write a single iptables rule that allows the communication of your Linux host only with the router. It cannot communicate with other hosts inside the same LAN. Do not modify the policy.

```sh
iptables -F

iptables -A INPUT -m mac --mac-source b4:6d:83:77:85:f5 -j ACCEPT

iptables -A INPUT -j DROP
```

(or)

```sh
iptables -A INPUT -m mac ! --mac-source b4:6d:83:77:85:f5 -j DROP
```

### Challenge #5

You have a LAN with a server and 5 hosts. The MAC addresses of the hosts are: b4:6d:83:77:85:f1 b4:6d:83:77:85:f2 b4:6d:83:77:85:f3 b4:6d:83:77:85:f4 b4:6d:83:77:85:f5

Write an iptables script on the server that allows only the communication with those 5 hosts. No other host is allowed to communicate with the server.

```sh
iptables -F

PERMITTED_MACS="b4:6d:83:77:85:f1 b4:6d:83:77:85:f2 b4:6d:83:77:85:f3 b4:6d:83:77:85:f4 b4:6d:83:77:85:f5"

for MAC in $PERMITTED_MACS
do
	iptables -A INPUT -m mac --mac-source $MAC -j ACCEPT
	echo "$MAC is permitted"
done

iptables -P INPUT DROP
```

### Challenge #6

Write the iptables rules that permit outgoing web traffic (tcp ports 80 and 443) only between 10:00 and 18:00 UTC.

```sh
iptables -A OUTPUT -p tcp --dport 80 -m time --timestart 10:00 --timestop 18:00 -j ACCEPT

iptables -A OUTPUT -p tcp --dport 443 -m time --timestart 10:00 --timestop 18:00 -j ACCEPT

iptables -A OUTPUT -p tcp --dport 80 -j DROP
iptables -A OUTPUT -p tcp --dport 443 -j DROP
```

(or)

```sh
iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -m time --timestart 10:00 --timestop 18:00 -j ACCEPT

iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -j DROP
```

### Challenge #7

Consider Challenge #6. Add a match to allow web traffic only on the weekend between 10:00 and 18:00 UTC.

```sh
iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -m time --timestart 10:00 --timestop 18:00 --weekdays Sat,Sun  -j ACCEPT

iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -j DROP
```

### Challenge #8
Write the iptables rules that permit only 2 incoming ICMP echo-request (ping) packets per second from any IP address. 

```sh
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 2/sec -j ACCEPT

iptables -A INPUT -p icmp --icmp-type echo-request -j DROP
```

### Challenge #9
Write an iptables rule that permits only 10 NEW TCP connections from the same IP address. 

To test this we need to create 10 active concurrent TCP connections.

```sh
iptables -A INPUT -p tcp --syn -m connlimit --connlimit-above 10 -j DROP
```