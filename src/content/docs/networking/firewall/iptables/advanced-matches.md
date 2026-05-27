---
title: Advanced matches
date: 22/05/2026
---


### Connection tracking

Netfilter has a module called `Conn tracking`. 

Connection tracking = ability to maintain state information about connections in memory tables.  

Firewalls that do this are called Stateful firewalls. Stateful firewalls are more secure than stateless firewalls.

#### Stateful firewall
A stateful firewall maintains detailed records of active connections through something called a "state table".
- This tables tracks evey connection from start to finish, remembering who initiated the conversation, what data was exchanged and whether the connection is legitimate.

#### Stateless firewall
Stateless firewalls depends on packets based counter part. 
- They operate on predefined rules, making decisions based on packet headers-source IP, destination IP, port numbers and protocols.
- They don't maintain connection state information.

- Stateful firewalss decide to accept or drop a packet based on the relations these packets are with other packets.
- Netfilter is a stateful firewall.
- Connection tracking can be used on any protocol, even if the protocol itself is stateless such as UDP, ICMP, etc...

#### Packets states
1. `NEW` - the first packet from a connection.
2. `ESTABLISHED` - packets that are part of an exisitng connection.
3. `RELATED` - packets that are requesting a new connection and are already part of an existing connection (Ex. FTP data transfer).
4. `INVALID` - packets that are not part of any existing connection.
5. `UNTRACKED` - packets marked within the raw tables with the NOTRACK target.

__Match:__
`-m state --state state`, where state is comma separated values of packet states written in UPPERCASE values.

Example:
*iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT*


#### Example1

Create a stateful firewall using iptables.

```sh
#!/bin/bash

iptables -F

# set policy to DROP on INPUT and OUTPUT CHAINS
iptables -P INPUT DROP
iptables -P OUTPUT DROP

# allow loopback interface traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Drop invalid packets on INPUT and OUTPUT CHAINS
iptables -A INPUT -m state --state INVALID -j DROP
iptables -A OUTPUT -m state --state INVALID -j DROP

# For INPUT chain, NEW state is not added
# Because we have to accept packets for which we made connection.
# by not including NEW, any person cannot make connection to our device, unless request.
# allow onlt ESTABLISHED and RELATED packets on INPUT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# allow also NEW packets on OUTPUT, packets that initialize connections
iptables -A OUTPUT -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
```

With the above rules, if anyone tries to connect to the device then the connection will be dropped.

- Try performing ping and ssh on the device and check the dropped packets.

#### Output1

```sh
root@fedora:/home/pradeep# iptables -nvL
Chain INPUT (policy DROP 10 packets, 607 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    1    67 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    0     0 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0            state INVALID
   26  2596 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    1    67 ACCEPT     all  --  *      lo      0.0.0.0/0            0.0.0.0/0           
    0     0 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0            state INVALID
   27  2018 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state NEW,RELATED,ESTABLISHED
```

#### Example2
In the above stateful firewall add a rule to accept ssh only from a particular ip.

```sh
#!/bin/bash

iptables -F

iptables -P INPUT DROP
iptables -P OUTPUT DROP

iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Example 2
# adding the rule here
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -s 192.168.122.1 -j ACCEPT
#iptables -A INPUT -p tcp --dport 22 --syn -s 192.168.122.1 -j ACCEPT

iptables -A INPUT -m state --state INVALID -j DROP
iptables -A OUTPUT -m state --state INVALID -j DROP

# For INPUT chain, NEW state is not added
# Because we have to accept packets for which we made connection.
# by not including NEW, any person cannot make connection to our device, unless request.
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
```

#### Output2
```sh
root@fedora:/home/pradeep# iptables -nvL
Chain INPUT (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    1    60 ACCEPT     tcp  --  *      *       192.168.122.1        0.0.0.0/0            tcp dpt:22 state NEW
    0     0 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0            state INVALID
   40  5048 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     all  --  *      lo      0.0.0.0/0            0.0.0.0/0           
    0     0 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0            state INVALID
   33  5215 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state NEW,RELATED,ESTABLISHED
```

### Filter by MAC address
- It is possible to filter traffic (ethernet and wireless) only using source MAC address, not by destination MAC address.
- MAC addresses are only valid in LAN (Local Area Network)
- We cannot impose strong security policy based on MAC address, because MAC addresses can be spoofed easily.
- The first router towards destination will change the MAC address of the packet with it's own MAC address (MAC address of it's out going interface address).

__Match:__ `-m mac --mac-source source_mac_address`

Example:
```sh
iptables -A INPUT -i wlan0 -m mac --mac-source 08:00:27:55:6f:20 -j DROP
```

Find MAC address using ifconfig.

```sh
virbr0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
inet 192.168.122.1  netmask 255.255.255.0  broadcast 192.168.122.255
ether 52:54:00:42:db:cd  txqueuelen 1000  (Ethernet)
RX packets 30779  bytes 1831452 (1.8 MB)
RX errors 0  dropped 0  overruns 0  frame 0
TX packets 59404  bytes 127869896 (127.8 MB)
TX errors 0  dropped 43 overruns 0  carrier 0  collisions 0
```

In the above o/p, `ehter` field is the MAC address.

#### Tasks

1. Drop packets from a specific MAC address

On the linux 2 machine, perform ping to linux 1.
By default, without any firewall, communication will work.

Add below firewall rule in linux 1

```sh
iptables -A INPUT -m mac --mac-source 52:54:00:42:db:cd -j DROP
```

now when ping is performed to linux-1 machine from linux-2, the ping will fail.

```sh
pradeep@pop-os:~$ ping 192.168.122.120
PING 192.168.122.120 (192.168.122.120) 56(84) bytes of data.
^C
--- 192.168.122.120 ping statistics ---
5 packets transmitted, 0 received, 100% packet loss, time 4125ms
```

Iptables o/p from linux-1
```sh
root@fedora:/home/pradeep/firewall# iptables -nvL
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    7   572 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0            MAC 52:54:00:42:db:cd

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@fedora:/home/pradeep/firewall# 
```


2. Permit only a list of trusted hosts (MACs) through the firewall (NAT router)

```sh
#!/bin/bash

iptables -F FORWARD

PERMITTED_MACS="52:54:00:42:db:cd f4:d1:08:ac:5b:75 fe:54:00:4a:02:39 3c:2c:30:d8:45:34"

for MAC in $PERMITTED_MACS
do 
	iptables -A FORWARD -m mac --mac-source $MAC -j ACCEPT
	echo "$MAC is permitted"
done

iptables -P FORWARD DROP
```

```sh
root@fedora:/home/pradeep/firewall# iptables -nvL
Chain INPUT (policy ACCEPT 96 packets, 7000 bytes)
 pkts bytes target     prot opt in     out     source               destination         
  450 70248 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0            MAC 52:54:00:42:db:cd

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            MAC 52:54:00:42:db:cd
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            MAC f4:d1:08:ac:5b:75
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            MAC fe:54:00:4a:02:39
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            MAC 3c:2c:30:d8:45:34

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@fedora:/home/pradeep/firewall# 
```


### Filter by date and time

__Match:__ `-m time option`

#### Time match __Options:__

| Option                  | Description                                                      | Format / Values                                                                               |
| ----------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `--datestart time`      | Start date and time to match                                     | ISO 8601 format: `YYYY[-MM[-DD[Thh[:mm[:ss]]]]]`                                              |
| `--datestop time`       | Stop date and time to match                                      | ISO 8601 format: `YYYY[-MM[-DD[Thh[:mm[:ss]]]]]`                                              |
| `--timestart time`      | Start daytime to match                                           | `hh:mm[:ss]`                                                                                  |
| `--timestop time`       | Stop daytime to match                                            | Between `00:00:00` and `23:59:59`                                                             |
| `[!] --monthdays value` | List of days of the month on which to match, separated by commas | Possible values: `1` to `31` (defaults to all days)                                           |
| `[!] --weekdays value`  | List of weekdays on which to match, separated by commas          | Possible values: `Mon, Tue, Wed, Thu, Fri, Sat, Sun` or `1` to `7` (defaults to all weekdays) |
| `--kerneltz`            | Use kernel timezone instead of UTC                               | No additional value required                                                                  |


#### Tasks

#### Task 1
Permit incoming ssh traffic only between 10AM and 4PM on weekdays

```sh
#!/bin/bash

iptables -F INPUT

# Here the time is in UTC format
iptables -A INPUT -p tcp --dport 22 -m time --timestart 10:00 --timestop 16:00 -j ACCEPT

iptables -A INPUT -p tcp --dport 22 -j DROP
```

By running the above command, the ssh packets are dropped. Because of the time format.

Time in IST
```sh
root@fedora:/home/pradeep/firewall# date
Sun May 24 11:12:18 AM IST 2026
root@fedora:/home/pradeep/firewall# 
```

But time in UTC,

```sh
root@fedora:/home/pradeep/firewall# date -u
Sun May 24 05:42:57 AM UTC 2026
root@fedora:/home/pradeep/firewall# 
```

Because the UTC time is below 10:00, the SSH packets are dropped.

```sh
root@fedora:/home/pradeep/firewall# iptables -nvL
Chain INPUT (policy ACCEPT 1952 packets, 3934K bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22 TIME from 10:00:00 to 16:00:00 UTC
    8   480 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
```

#### Task 2
Allow access to a specific website only after working hours (6:00 PM) and only on working days (Mon to Fri).


```sh
#!/bin/bash

iptables -F OUTPUT

iptables -A OUTPUT -d www.ubuntu.com -m time --timestart 18:00 --timestop 08:00 --weekdays Mon,Tue,Wed,Thu,Fri -j ACCEPT

iptables -A OUTPUT -d www.ubuntu.com -j DROP
```

Now perform curl operation on www.ubuntu.com.
The curl operation will fail, because the date is SUNDAY, which is not accepted.

```sh
root@fedora:/home/pradeep/firewall# curl https://www.ubuntu.com
^C^C
root@fedora:/home/pradeep/firewall# 
root@fedora:/home/pradeep/firewall# date -u
Sun May 24 06:11:16 AM UTC 2026
root@fedora:/home/pradeep/firewall# 
root@fedora:/home/pradeep/firewall# iptables -nvL
Chain INPUT (policy ACCEPT 2059 packets, 3947K bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 36 packets, 3155 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            185.125.190.21       TIME from 18:00:00 to 08:00:00 on Mon,Tue,Wed,Thu,Fri UTC
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            185.125.190.20       TIME from 18:00:00 to 08:00:00 on Mon,Tue,Wed,Thu,Fri UTC
    0     0 ACCEPT     all  --  *      *       0.0.0.0/0            185.125.190.29       TIME from 18:00:00 to 08:00:00 on Mon,Tue,Wed,Thu,Fri UTC
    0     0 DROP       all  --  *      *       0.0.0.0/0            185.125.190.21      
    5   300 DROP       all  --  *      *       0.0.0.0/0            185.125.190.29      
    5   300 DROP       all  --  *      *       0.0.0.0/0            185.125.190.20      
root@fedora:/home/pradeep/firewall# 
```

### connlimt match

__Match:__ `-m connlimit option`

__Options:__

   `--connlimit-upto n`: match if the number of existing connections is less than n
   
   `--connlimit-above n`: match if the number of existing connections is greater than n

Example:
```sh
iptables -A INPUT -p tcp --dport 25 --syn -m connlimit --connlimit-above 5 -j REJECT --reject-with tcp-rst*
```


### limit match
The limit match uses a token packet the restrains the rate of matches.

__Match:__ `-m limit option`

__Options:__

   `--limit value`: Where value is the maximum matches per time-unit (default second)

   `--limit-brust value`: where value is maximum brust (matches) before the above limit "kicks in" (default 5).

__Examples:__
```sh
iptables -A FORWARD -m limit --limit 1/minute -p udp --dport 53 -j LOG

iptables -A INPUT -p tcp --syn -m limit --limit 2/s --limit-burst 7 -j ACCEPT
```

__Note:__ If no packets hit the limit rate, the the limit-burst will gradually increase based on the limit-rate.

#### How limit works:

Suppose we have a rule:

```sh
-m limit --limit 2/minute --limit-burst 5
```

Initially, the bucket will have 5 tokens
When packet arrives consume one token

```sh
Packet 1 → ACCEPT (4 left)
Packet 2 → ACCEPT (3 left)
Packet 3 → ACCEPT (2 left)
Packet 4 → ACCEPT (1 left)
Packet 5 → ACCEPT (0 left)
```

now bucket is empty.

Packet 6 will be **Dropped / no match**.

But tokens refill at 

```sh
2 per minute
```

after 30 seconds, token will be filled and packet can be allowed.

#### Tasks:

#### Task 1
Write a firewall rule to accept only 1 packet per second with a burst of 7.

```sh
# Rule explaination:
# We are accpeting ICMP echo request and there is a deposit or burst of 7 packets. These 7 packets will be accpeted no matter what speed they arrive.
# After the burst limit, only one packet will be accpeted per second.
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/sec --limit-burst 7 -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP
```

To see the packet arrival, we can can tcpdump on the linux-1 machine. And perform ping to linux-1 from linux-2.

#### ping o/p
```sh
pradeep@pop-os:~$ ping -i 0.1 192.168.122.120
PING 192.168.122.120 (192.168.122.120) 56(84) bytes of data.
64 bytes from 192.168.122.120: icmp_seq=1 ttl=64 time=0.434 ms
64 bytes from 192.168.122.120: icmp_seq=2 ttl=64 time=0.616 ms
64 bytes from 192.168.122.120: icmp_seq=3 ttl=64 time=0.558 ms
64 bytes from 192.168.122.120: icmp_seq=4 ttl=64 time=0.437 ms
64 bytes from 192.168.122.120: icmp_seq=5 ttl=64 time=0.331 ms
64 bytes from 192.168.122.120: icmp_seq=6 ttl=64 time=0.354 ms
64 bytes from 192.168.122.120: icmp_seq=7 ttl=64 time=0.542 ms
64 bytes from 192.168.122.120: icmp_seq=11 ttl=64 time=0.311 ms
64 bytes from 192.168.122.120: icmp_seq=21 ttl=64 time=0.369 ms
64 bytes from 192.168.122.120: icmp_seq=30 ttl=64 time=0.353 ms
64 bytes from 192.168.122.120: icmp_seq=40 ttl=64 time=0.343 ms
64 bytes from 192.168.122.120: icmp_seq=50 ttl=64 time=0.409 ms
^C
--- 192.168.122.120 ping statistics ---
57 packets transmitted, 12 received, 78.9474% packet loss, time 5829ms
rtt min/avg/max/mdev = 0.311/0.421/0.616/0.095 ms
```

In the above o/p, we can see that the initial 7 packets response was received successfully. But after that, the response was sent only for **icmp_seq=11,21,30,40,50**. This happened because the firewall dropped the packets and sent only response every 1s.

We can check the tcpdump of linux-1
#### tcpdump of linux-1

```sh
root@fedora:/home/pradeep/firewall# tcpdump -p icmp
dropped privs to tcpdump
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on enp1s0, link-type EN10MB (Ethernet), snapshot length 262144 bytes

# Repsonse for burst limit
18:10:53.662765 IP _gateway > fedora: ICMP echo request, id 4, seq 1, length 64
18:10:53.662822 IP fedora > _gateway: ICMP echo reply, id 4, seq 1, length 64
18:10:53.771510 IP _gateway > fedora: ICMP echo request, id 4, seq 2, length 64
18:10:53.771585 IP fedora > _gateway: ICMP echo reply, id 4, seq 2, length 64
18:10:53.875527 IP _gateway > fedora: ICMP echo request, id 4, seq 3, length 64
18:10:53.875583 IP fedora > _gateway: ICMP echo reply, id 4, seq 3, length 64
18:10:53.980346 IP _gateway > fedora: ICMP echo request, id 4, seq 4, length 64
18:10:53.980415 IP fedora > _gateway: ICMP echo reply, id 4, seq 4, length 64
18:10:54.083226 IP _gateway > fedora: ICMP echo request, id 4, seq 5, length 64
18:10:54.083273 IP fedora > _gateway: ICMP echo reply, id 4, seq 5, length 64
18:10:54.187660 IP _gateway > fedora: ICMP echo request, id 4, seq 6, length 64
18:10:54.187715 IP fedora > _gateway: ICMP echo reply, id 4, seq 6, length 64
18:10:54.291518 IP _gateway > fedora: ICMP echo request, id 4, seq 7, length 64
18:10:54.291572 IP fedora > _gateway: ICMP echo reply, id 4, seq 7, length 64

# Requests dropped because of limit match
18:10:54.395318 IP _gateway > fedora: ICMP echo request, id 4, seq 8, length 64
18:10:54.500413 IP _gateway > fedora: ICMP echo request, id 4, seq 9, length 64
18:10:54.603313 IP _gateway > fedora: ICMP echo request, id 4, seq 10, length 64

# Response sent after limit completion
18:10:54.707227 IP _gateway > fedora: ICMP echo request, id 4, seq 11, length 64
18:10:54.707276 IP fedora > _gateway: ICMP echo reply, id 4, seq 11, length 64

# and so on....
```

#### iptables o/p of linux-1
```sh
root@fedora:/home/pradeep/firewall# iptables -nvL
Chain INPUT (policy ACCEPT 8942 packets, 4464K bytes)
 pkts bytes target     prot opt in     out     source               destination         
   20  1680 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0            icmptype 8 limit: avg 1/sec burst 7
   49  4116 DROP       icmp --  *      *       0.0.0.0/0            0.0.0.0/0            icmptype 8

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 9526 packets, 892K bytes)
 pkts bytes target     prot opt in     out     source               destination         
```

#### Task 2
Allow only 5 new incoming connections per second to port 443 (https)

```sh
iptables -A INPUT -p tcp --dport 443 --syn -m limit --limit 5/sec -j ACCEPT
iptables -A INPUT -p tcp --dport 443 --syn -j DROP
```

### Recent match
It creates a dynamic database of blacklisted source ip addresses.

__Match:__ `-m recent option`

__Option:__

   `--name name` : Creates a list in which the source IP address will be added and checked.

   `--set` : Adds the source IP address to the list.

   `--update` : Checks if the source IP address is in the list and updates the "last seen time"

   `--rcheck` : Checks if the source IP address is in the list and DOESN'T update the "last seen time"

   `--seconds` : Used with `--update` or `--rcheck`. Matches the packet only if the source IP address is in the list and last seen time is valid.

> __NOTE:__ The list with blacklisted IP addresses is found in: `/proc/net/xt_recent/LIST_NAME`

__Example:__
```sh
# The recent match checks if the incoming source ip address is in the badguys list or not. If it is available, then last seen time and quite time of 60 seconds.
# The Quite time means that after this time period only the packet from the ip addres will be accpeted and IP will be added to the badguys list by second rule when condition is statisfied.
iptables -A FORWARD -m recent --name badguys --update --seconds 60 -j DROP

# The below rule adds the IP of tcp packets that are coming on interface eth0 with destination port 8080.
iptables -A FORWARD -p tcp -i eth0 --dport 8080 -m recent --name badguys --set -j DROP
```

#### Tasks
#### Task 1

Create a firewall rule to drop and tracks the source IP address SSH packets that arrive in interval between 06:00 PM to 10:00 PM on Weekdays (SAT and SUN). And have quiet time of 60 seconds.

```sh
#!/bin/bash

iptables -F INPUT

# Only stop SSH packets after quite time from blacklisted list
iptables -A INPUT -p tcp --dport 22 -m recent --name hackers --update --seconds 60 -j DROP

# Stop all packets from the source IP
iptables -A INPUT -m recent --name hackers --update --seconds 60 -j DROP

iptables -A INPUT -p tcp --dport 22 -m recent --name hackers --set -m time --timestart 18:00 --timestop 22:00 --weekdays Sat,Sun -j DROP
```

### Quota Match
- When the Quota is reached, the rule doesn't mach any more.

__Match:__ `-m quota --quota bytes`

__Example:__
```sh
iptables -A OUTPUT -d 80.0.0.1 -p tcp --sport 80 -m quota --quota 100000000000 -j ACCEPT
iptables -A OUTPUT -d 80.0.0.1 -p tcp --sport 80 -j DROP
```

#### Tasks:

#### Task1

Create firewall that will allow SSH traffic with a quota of 10MB.

```sh
#!/bin/bash

iptables -F INPUT

iptables -A INPUT -s 192.168.122.1 -p tcp --dport 22 -m quota --quota 10000000 -j ACCEPT

iptables -A INPUT -s 192.168.122.1 -p tcp --dport 22 -j DROP
```

```sh
root@fedora:/home/pradeep/firewall# iptables -nvL
Chain INPUT (policy ACCEPT 9569 packets, 4537K bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     tcp  --  *      *       192.168.122.1        0.0.0.0/0            tcp dpt:22 quota: 10000000 bytes
    0     0 DROP       tcp  --  *      *       192.168.122.1        0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 10393 packets, 970K bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@fedora:/home/pradeep/firewall#
```

Perform SCP from linux-2 machine to linux-1 machine.

```sh
pradeep@pop-os:~/Downloads$ scp MQTTX_1.12.0_amd64.deb pradeep@192.168.122.120:~
pradeep@192.168.122.120's password: 
MQTTX_1.12.0_amd64.deb                       0%    0     0.0KB/s   --:-- ETA^Cpradeep@pop-os:~/Downloads$ 
```

in Linux-1 machine:

File in home directory:

```sh
root@fedora:/home/pradeep# ls -lah MQTTX_1.12.0_amd64.deb 
-rw-r--r--. 1 pradeep pradeep 9.5M May 24 20:48 MQTTX_1.12.0_amd64.deb
root@fedora:/home/pradeep# 
```
Only 9.5 MB data is copied and others are dropped.

```sh
root@fedora:/home/pradeep# iptables -nvL
Chain INPUT (policy ACCEPT 9578 packets, 4538K bytes)
 pkts bytes target     prot opt in     out     source               destination         
  397 9972K ACCEPT     tcp  --  *      *       192.168.122.1        0.0.0.0/0            tcp dpt:22 quota: 10000000 bytes
   30  423K DROP       tcp  --  *      *       192.168.122.1        0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 10735 packets, 1009K bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@fedora:/home/pradeep# 
```

#### Task2

```sh
#!/bin/bash

##** MATCH BY QUOTA **##

iptables -F

# permit max QUOTA bytes from protocol tcp and port 80 (ROUTED TRAFFIC, we are the ROUTER)
# traffic is generated by a server inside our LAN. This is downloaded traffic by Internet clients from our server.

### EDIT the values below ###
PROTOCOL="tcp"
PORT="80"
#1GB
QUOTA1="1000000000"
#this is the outgoing interface
INT="eth0"
###

###DO NOT EDIT BELOW THIS LINE
iptables -A FORWARD -o $INT -p $PROTOCOL --sport $PORT -m quota --quota $QUOTA1 -j ACCEPT
iptables -A FORWARD -o $INT -p $PROTOCOL --sport $PORT 				-j DROP



# permit max 100MB of incoming https traffic from the web site with the address 100.0.0.1

### EDIT the values below ###
HTTPS_SERVER="100.0.0.1"
PROTOCOL="tcp"
PORT="443"
#100MB
QUOTA2="100000000"
###

###DO NOT EDIT BELOW THIS LINE
iptables -A INPUT -s $HTTPS_SERVER -p $PROTOCOL --sport $PORT -m quota --quota $QUOTA2 -j ACCEPT
iptables -A INPUT 		   -p $PROTOCOL --sport $PORT 			       -j DROP

```