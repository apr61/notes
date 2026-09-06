---
title: Diife Hellman
date: 06/09/2026
---

## Diffie-Hellman Function

- Non-zero integer numbers modulo a prime number, denoted by `p`. 
- Public parameter is the base number,`g`
- All arithmetic operations are performed modulo `p`

The DH function involves two private values chosen randomly by the communicating parties, denoted `a` and `b`.

A private key value `a` has a public key value `A = g ^ a mod p`
A private key value `b` has a public key value `B = g ^ b mod p`

The public key values are shared through a message that can be seen by anyone.

DH works it's magic by combining either public value with the other private value, such that the result is same in both the cases.

`A ^ b = (g ^ a) ^ b = g ^ ab` and  `B ^ a = (g ^ b) ^ a = g ^ ba = g ^ ab`

The resulting `g ^ ab` is the shared secret. It is then passed to a key derivation function (KDF) in order to generate one or more shared symmetric keys.

A KDF is a kind of hash function that will return a random-looking string the size of desired key length.


