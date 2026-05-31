---
title: Ipset
date: 28/05/2026
---

- Iptables itself doesnot support matching multiple separate addresses or networks in one rule.

- Ipset is an extension to iptables that allows us to create firewall rules that match entire "sets" of addresses at once.

- Unlike normal iptables chains, which are stored and traversed linearly, IP sets are stored in indexed data structures, matching lookups very efficient.

- Ipset lets us create huge lists of ip addresses and/or ports with tens of thousands of entries.

#### Install ipset

```sh
sudo apt install ipset
```

#### ipset help
```sh
ipset help | less
```


- You create a unique ipset name using ipset utiliy and refer the name in one or more iptables match option.


## ipset commands

### Create a new ipset
We can create a new ipset using

```sh
ipset -N myset hash:ip
```
(or)
```sh
ipset create office hash:net
```

If we try to create set with the smae name then, ipset will through an error.

```sh
root@fedora:/home/pradeep# ipset -N myset hash:ip
root@fedora:/home/pradeep# 
root@fedora:/home/pradeep# ipset -N myset hash:ip
ipset v7.22: Set cannot be created: set with the same name already exists
root@fedora:/home/pradeep# 
```

To resolve this, we can use the `-exist` option.
```sh
root@fedora:/home/pradeep# ipset -N office hash:ip
root@fedora:/home/pradeep# 
root@fedora:/home/pradeep# ipset -N office hash:ip -exist
```

> __Note__: If the same set is created with `-exist`, the content of the ipset will not be flushed.

hash:ip => it is used to store set of ip addresses
hash:net => it is used to store set of networks

```sh
ipset -N wano iphash
# is same as
ipset -N wano hash:ip 
```

```sh
ipset -N wano nethash
# is same as
ipset -N wano hash:net 
```

### Add IP to set
We can add Ip to an set using `add` or `-A` options.

`-exist` option can be used to append, exisiting IP to the set (for no error)

```sh
ipset add myset 1.0.0.1

ipset -A myset 1.1.1.1

ipset -A myset 1.1.1.1 -exist
```

### Use set reference in iptables
An ipset can be used in iptables using the `-m set` match.

Match:
`-m set --match-set set_name src/dst`

```sh
# Iptables rule to drop ip from set on source
iptables -A INPUT -m set --match-set myset src -j DROP

# Iptables tule to drop ip from set on destination
iptables -A OUTPUT -m set --match-set myset dst -j DROP
```

### Listing the members of set

We can list the entries of set using options `-L, list`

```sh
# List all the set's with entries
ipset list
ipset -L 

# list entries of a specific set
ipset -L myset

# Lit only the set name
ipset -L -n
```

#### O/p example

```sh
root@fedora:/home/pradeep# ipset -L myset
Name: myset
Type: hash:ip
Revision: 6
Header: family inet hashsize 1024 maxelem 65536 bucketsize 12 initval 0x74ec31e5
Size in memory: 216
References: 2
Number of entries: 0
Members:
root@fedora:/home/pradeep# ipset -L
Name: myset
Type: hash:ip
Revision: 6
Header: family inet hashsize 1024 maxelem 65536 bucketsize 12 initval 0x74ec31e5
Size in memory: 296
References: 2
Number of entries: 2
Members:
1.1.1.2
1.1.1.1

Name: myset_net
Type: hash:net
Revision: 7
Header: family inet hashsize 1024 maxelem 65536 bucketsize 12 initval 0xf4a34d3a
Size in memory: 456
References: 0
Number of entries: 0
Members:
```

### Deleting an entry from a set
An entry from set can be deleting using option `-D, del`

```sh
ipset -D myset 1.1.1.1

ipset del myset 1.2.2.3
```

### Flushing all entries from set
We can flush entries from a set using `-F, flush` option

```sh
iptables -F myset

iptables -F my_set_net

# Flush entries from all the sets
iptables -F
```

### Setting max element in a set
We can set the max elements that an set can hold using `maxelem` option.
Default value - 65535

```sh
ipset create myset1 iphash maxelem 2048
```

#### O/p

```sh
root@fedora:/home/pradeep# ipset create myset_1 hash:ip maxelem 2048
root@fedora:/home/pradeep# ipset -L myset_1
Name: myset_1
Type: hash:ip
Revision: 6
Header: family inet hashsize 1024 maxelem 2048 bucketsize 12 initval 0x40b8a7bf
Size in memory: 216
References: 0
Number of entries: 0
Members:
```

### Destroy a set
We can destory a set using `-X, destroy` option

```sh
ipset -X myset

ipset destroy myset_1

# Destroy all the sets
ipset -X
```

> __NOTE__: We cannot destroy a set, if it's reference is used. 

- We can delete the iptables commands to free the reference of the ipset.

```sh
root@fedora:/home/pradeep# ipset -X myset
ipset v7.22: Set cannot be destroyed: it is in use by a kernel component
root@fedora:/home/pradeep# 
root@fedora:/home/pradeep# ipset -L myset
Name: myset
Type: hash:ip
Revision: 6
Header: family inet hashsize 1024 maxelem 65536 bucketsize 12 initval 0x74ec31e5
Size in memory: 216
References: 2
Number of entries: 0
Members:
root@fedora:/home/pradeep# 
```

## Usecases of ipset

### UseCase 1: Automatically block bad hosts

Let say, we can't to block all the host who are trying to make certain type of request such as accessing http services instead of https. For that we can use ipset to block the hosts.

#### Step1: Create a set

```sh
ipset -N auto_blocked iphash 
```

#### Step2: Create iptables rule to add ip's to set based on condition

```sh
# Add the source ip of the packet to the set
iptables -I INPUT -p tcp --dport 80 -j SET --add-set auto_blocked src 
```

#### Step3: Use the ipset to drop the packets

```sh
iptables -I INPUT -m set --match-set auto_blocked src -j DROP
```

#### Check the auto block rules

1. From the linux-2 (192.168.122.1) machine ping the linux-1 ( 192.168.122.120) machine

```sh
pradeep@pop-os:~/Learning/frontend/notes$ ping  192.168.122.120
PING 192.168.122.120 (192.168.122.120) 56(84) bytes of data.
64 bytes from 192.168.122.120: icmp_seq=1 ttl=64 time=0.243 ms
64 bytes from 192.168.122.120: icmp_seq=2 ttl=64 time=0.154 ms
64 bytes from 192.168.122.120: icmp_seq=3 ttl=64 time=0.223 ms
```

2. Peform a port scan on linux-1 from linux-2 on port 80 (http)

```sh
pradeep@pop-os:~/Learning/rust/loops$ nmap -p 80 192.168.122.120
Starting Nmap 7.80 ( https://nmap.org ) at 2026-05-31 19:01 IST
Nmap scan report for 192.168.122.120
Host is up (0.00041s latency).

PORT   STATE    SERVICE
80/tcp filtered http

Nmap done: 1 IP address (1 host up) scanned in 0.43 seconds
pradeep@pop-os:~/Learning/rust/loops$ 
```

3. After performing Step 2, the ping from Linux-2 to Linux-1 will be blocked.

```sh
pradeep@pop-os:~/Learning/frontend/notes$ ping  192.168.122.120
PING 192.168.122.120 (192.168.122.120) 56(84) bytes of data.
64 bytes from 192.168.122.120: icmp_seq=1 ttl=64 time=0.243 ms
64 bytes from 192.168.122.120: icmp_seq=2 ttl=64 time=0.154 ms
64 bytes from 192.168.122.120: icmp_seq=3 ttl=64 time=0.223 ms
64 bytes from 192.168.122.120: icmp_seq=4 ttl=64 time=0.477 ms
64 bytes from 192.168.122.120: icmp_seq=5 ttl=64 time=0.534 ms
^C
--- 192.168.122.120 ping statistics ---
15 packets transmitted, 5 received, 66.6667% packet loss, time 14323ms
rtt min/avg/max/mdev = 0.154/0.326/0.534/0.150 ms
```

4. In the linux-1 machine, the linux-2 ip is added to the ipset and all the packets from linux-2 are dropped.

#### Ipset output

```sh
root@fedora:/home/pradeep# ipset -L auto_block
Name: auto_block
Type: hash:ip
Revision: 6
Header: family inet hashsize 1024 maxelem 65536 bucketsize 12 initval 0x8de195cf
Size in memory: 256
References: 2
Number of entries: 1
Members:
192.168.122.1 # linux-2 IP
```

#### iptables o/p

```sh
root@fedora:/home/pradeep# iptables -nvL
Chain INPUT (policy ACCEPT 170 packets, 30811 bytes)
 pkts bytes target     prot opt in     out     source               destination         
   19  1284 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0            match-set auto_block src
    1    60 SET        tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:80 add-set auto_block src

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@fedora:/home/pradeep# 
```

### UseCase 2: Block all IP addresses from a file

Let say we have a linux server, that hosts multiple services such as HTTP, HTTPS, SSH, Mail, etc. Over time the server logs authentication failures, scans and malicious attmepts.

We want to create script to read from file of source ip addresses, that tried to attack our server and completly block the ip address.

```sh
#!/bin/bash

BAD_HOSTS_FILE="bad_hosts.txt"
BAD_HOSTS_SET="bad_hosts"

# Create new ipset to store bad hosts
ipset -N $BAD_HOSTS_SET iphash -exist

# Flush all entries from set
ipset -F $BAD_HOSTS_SET

echo "Created and flushed from set: $BAD_HOSTS_SET"

echo "Adding ip's from file to $BAD_HOSTS_SET set:"
for ip in `cat $BAD_HOSTS_FILE`
do
	ipset add $BAD_HOSTS_SET $ip
	echo -n "$ip "
done

echo -e -n "\nDropping with iptables"

iptables -A INPUT -m set --match-set $BAD_HOSTS_SET src -j DROP

echo "Done"
```

### UseCase 3: Block countries

```sh
#!/bin/bash

echo "### Blocking CHINA###"

ipset -N china hash:net -exist

ipset -F china

if [ -f "cn-aggregated.zone" ]
then
	rm cn-aggregated.zone	
fi

# Download the appropriate zone file for China

wget https://www.ipdeny.com/ipblocks/data/aggregated/cn-aggregated.zone

if [ $? -eq 0 ]
then
	echo "downloaded cn-aggregated.zone file successfully"
fi

for net in `cat cn-aggregated.zone`
do
	ipset -A china $net
done

echo "Added cn-aggregated.zone networks to ipset: china"

# Create iptables rule to use the ipset
iptables -I INPUT -m set --match-set china src -j DROP

echo "Done"
```

## Clearing a running firewall

```sh
#!/bin/bash

echo "Setting ACCEPT policy"
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

echo "Flushing all the tables"
iptables -t filter -F
iptables -t nat -F
iptables -t mangle -F
iptables -t raw -F

echo "Deleting user defined chains"
iptables -X

echo "Flusing all ipset's"
ipset -F

echo "Destroying all ipset's"
ipset -X
```

