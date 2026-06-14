---
title: iptables
date: 08/03/2025
---

## What is firewall?
Firewalling is an idea that decides which packets are allowed to go in/out of a system.

Allowing which port to communicate with outside world is the responsibility of firewall. 

## What is iptables?

In Linus OS, firewalling is taken care by <code>netfilter</code>. <code>netfilter</code> is a kernel module that decides which packets are allowed to enter or leave (go outside).

<code>iptables</code> is a interface for <code>netfilter</code>.


**Note** - Other tools like <code>iptables</code> are <code>firewalld</code> and <code>ufw</code>.


## Iptables architecture

1. chains
2. tables
3. targets

### Chains
There are a total of five chains in <code>iptables</code>.

1. **PREROUTING** - This chain decides what happens to a packet as soon as it arrives at the network interface. We can alter the packet, drop the packet or doing nothing. Used in DNAT/Port forwarding.

2. **INPUT** - This is one of the popular chains. This is where packets enter the system. Blocking/opening of a port can be can be done in this chain.

3. **FORWARD** - This chain is responsible for packet forwarding.

4. **OUTPUT** - This is the chain where packets are emitted by/leaving the system.
5. **POSTROUTING** - This is the chain where packets leave their trace last, before leaving the computer. Used for SNAT/ MASQUERADE

### Tables
There are five tables in <code>iptables</code>

1. **filter** - This is default table. This table decides whether a packet is allowed in/out of computer. Blocking of port or stop receiving anything can be done here.
	Common chains are
		1. INPUT
		2. OUTPUT
		3. FORWARD

2. **nat** - Modifies source/destination IP addresses for NAT.
	Common chains are
		1. PREROUTING
		2. POSTROUTING
		3. OUTPUT

3. **mangle** - Modifies packet headers either before coming or leaving out. 
	Common chains are
		1. PREROUTING
		2. POSTROUTING
		3. INPUT
		4. OUTPUT
		5. FORWARD

4. **raw** - Used mainly to track connection state. The raw table is only used to set a mark on packets that should not be handled by the connection tracking system. This is done by using the `NOTRACK` target on the packet.
	Common chains are
		1. PREROUTING
		2. OUTPUT

5. **security** - It is responsible for securing your computer after filter table. Which consists of SELinux.
	Common chains are
		1. INPUT
		2. OUTPUT
		3. FORWARD

### targets

targets define where a packet should go. This is decided using either <code>iptables</code> own targets: <code>ACCEPT</code>, <code>DROP</code> or <code>RETURN</code>. Or using it's extensions.

iptable extensions are <code>DNAT</code>, <code>LOG</code>, <code>MASQUERADE</code>, <code>REJECT</code>, <code>SNAT</code>, <code>TRACE</code> and <code>TTL</code>, including the above there are other 39.

Targets are divided into terminating and non-terminating.

Terminating ends rule traversal and the packets will be stopped.
Non-terminating ones touch a packet in some way and the rule traversal will continue afterward.




