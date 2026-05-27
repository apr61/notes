---
title: Iptables commands
date: 26/05/2026
---

### Delete a rule
We can drop an iptable rule using the `-D` option of the iptables.

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -nvL
Chain INPUT (policy ACCEPT 281 packets, 27444 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    7   450 ACCEPT     tcp  --  *      *       13.127.223.245       0.0.0.0/0            tcp dpt:80
    3   180 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:80

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@ip-172-31-15-118:/home/ubuntu#
```

In the above iptables o/p, I want to delete the `DROP` target rule.

We can delete the rule using below command

```sh
iptables -t filter -D INPUT 2 # -> Here 2 is the line number
```

After running the above command we can see something like this

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -nvL
Chain INPUT (policy ACCEPT 413 packets, 37303 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    7   450 ACCEPT     tcp  --  *      *       13.127.223.245       0.0.0.0/0            tcp dpt:80

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@ip-172-31-15-118:/home/ubuntu# 
```

### -A vs -I


-> We can use `-I`, when we already have a lot of rules and want to add rule on top.


### Listing the firewall
iptables options:
`-L`: List all rules in the selected chain. If no chain is selected, all chains are listed.
`-S`: Print all the rules in the selected chain.
`-v`: verbse output, prints interface name, packets and bytes counters.
`-n`: avoid long reverse DNS lookups. Print IP address and port numbers instead of domain and service names.

#### -L

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -L
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
DROP       tcp  --  anywhere             anywhere             tcp dpt:http
ACCEPT     tcp  --  ec2-13-127-223-245.ap-south-1.compute.amazonaws.com  anywhere             tcp dpt:http

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination         
root@ip-172-31-15-118:/home/ubuntu# 
```

#### -n

We can notice that with `-n` option, the DNS name is no longer shown in the o/p. Instead we are seeing the ip address (13.127.223.245).

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -L -n
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:80
ACCEPT     tcp  --  13.127.223.245       0.0.0.0/0            tcp dpt:80

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination         
root@ip-172-31-15-118:/home/ubuntu# 
```

#### -v
We can see the `pkts` and `bytes` section the iptables o/p.
```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -L -n -v
Chain INPUT (policy ACCEPT 1497 packets, 168K bytes)
 pkts bytes target     prot opt in     out     source               destination         
    2   115 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:80
    7   450 ACCEPT     tcp  --  *      *       13.127.223.245       0.0.0.0/0            tcp dpt:80

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@ip-172-31-15-118:/home/ubuntu# 
```

We can combine all the three listing options

```sh
iptables -L -n -v
```

is same as 

```sh
iptables -nvL
```

#### Listing by CHAIN

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -t nat -nvL PREROUTING
Chain PREROUTING (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
```

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -t nat -nvL INPUT
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
```

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -nvL INPUT
Chain INPUT (policy ACCEPT 2279 packets, 239K bytes)
 pkts bytes target     prot opt in     out     source               destination         
    8   450 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:80
    7   450 ACCEPT     tcp  --  *      *       13.127.223.245       0.0.0.0/0            tcp dpt:80   
```

### Default policy
- Policy specifies what will happen to packets that are not matched against any rule.
- Be default, Policy is set to ACCEPT all traffic.
- Policy can be changed `only for INPUT, OUTPUT and FORWARD chains`.
- Policy can be changed usng `-P` option.
- Policy will be applied at the end of the CHAIN.

#### Examples

Before running the DROP policy command

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -nvL
Chain INPUT (policy ACCEPT 2884 packets, 302K bytes)
 pkts bytes target     prot opt in     out     source               destination         
   13   888 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@ip-172-31-15-118:/home/ubuntu# 
```

```sh
iptables -P INPUT DROP
```

The default policy in the filter table INPUT chain is DROP now.

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -nvL
Chain INPUT (policy DROP 33 packets, 2566 bytes)
 pkts bytes target     prot opt in     out     source               destination         
  165 11424 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@ip-172-31-15-118:/home/ubuntu# 
```

And if we try to ping or perform http connection to the host, then the packets will be dropped.

```sh
root@ip-172-31-13-34:/home/ubuntu# ping 13.203.209.249
PING 13.203.209.249 (13.203.209.249) 56(84) bytes of data.
^C
--- 13.203.209.249 ping statistics ---
10 packets transmitted, 0 received, 100% packet loss, time 9244ms

root@ip-172-31-13-34:/home/ubuntu# curl -v http://13.203.209.249
*   Trying 13.203.209.249:80...
^C
root@ip-172-31-13-34:/home/ubuntu# 
```

We can see the packets are getting dropped at the host.

```sh
root@ip-172-31-15-118:/home/ubuntu# iptables -nvL
Chain INPUT (policy DROP 60 packets, 5095 bytes)
 pkts bytes target     prot opt in     out     source               destination         
  179 12276 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
root@ip-172-31-15-118:/home/ubuntu# 
```

NOTE: By making the defualt policy as `DROP`, we are disconnecting the host from the internet.


### iptables-save and iptables-restore
- Rules created with iptables command are stored only in memory.
- if the system is restarted before saving the iptables rule set, all the rules are lost.
- `iptables-save` dumps rules to stdout or to a file.
- `iptables-restore` loads rules from a file to memory.

#### Saving the rules in ubuntu/debian based OS
- with the help of `iptables-persistent` binary rules will be loaded at system bootup.
- The iptables-persistent binary reads the rules from `/etc/iptables/rules.v4` location.

#### RedHat/CentOS
- Execute `/sbin/service iptables save`. 
- The above command runs `iptable-save` that writes iptables configuration to `/etc/sysconfig/iptables`.

