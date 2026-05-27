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