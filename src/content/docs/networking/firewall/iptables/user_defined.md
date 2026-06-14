---
title: User Defined Chains
date: 14/06/2026
---

- By default, the iptables `filter` table consists of thress built-in chains: `INPUT`, `OUTPUT` and `FORWARD`.
- We can add as many custom (user-defined) chains as we like to help simplify managing large rule sets.
- User-defined chains are useful in optimizing the ruleset. They allow the rules to be organized in categories.

- From in-built chain using `-j CUSTOM-CHAIN`, we can jump into a custom chain.
- After the user-defined chain is travered, control returns to the calling built-in chain.
- And matching continues from the next rule in the calling chain, unless the user-defined chain matched and took a terminating action on the packet.

- Before deleting a CUSTOM-CHAIN it's reference should be deleted from the in-built chain.
- We can create custom-chains on any table of the iptables.
- custom-chains doesnot have any defualt policy.

### RETURN target usage 

- The `RETURN` target in a rule of a custom chain makes processing resume back in the cahin that called the custom chain.

- `-j RETURN` can also be used inside a built-in chain. In this case no other rule will be inspected and packet executes the default POLICY.

- If you want to stop using your custom chain temporarily, you can simply delete the jump rule from the INPUT chain.


### Options to create custom chains

`-N NEW_CAHIN` - Creates a new user-defined chain
`-L NEW_CHAIN` - lists the content of the chain
`-X NEW_CHAIN` - deletes the custom-chain (it must be emptied before, using -F)
`-F NEW_CAHIN` - Flushes all rules from the chain

### Use custom chain

```sh
iptables -N TCP_TRAFFIC

iptables -A TCP_TRAFFIC -p tcp --dport 80 -j DROP
```

#### Link custom chain to in-built chain

```sh
iptables -A INPUT -j TCP_TRAFFIC
```


```sh
root@fedora:/home/pradeep# iptables -A INPUT -j TCP_TRAFFIC
root@fedora:/home/pradeep# 
root@fedora:/home/pradeep# iptables -nvL 
Chain INPUT (policy ACCEPT 3 packets, 313 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    3   313 TCP_TRAFFIC  all  --  *      *       0.0.0.0/0            0.0.0.0/0           

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain TCP_TRAFFIC (1 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:80
root@fedora:/home/pradeep# 
```

