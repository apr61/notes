---
title: ECC Overview
date: 22/11/2025
---

ECC stands for Elliptic Curve Cryptography. It is a type of public key (asymmetric) cryptography based on the mathematics of elliptic curvesss over finite fields.

It is widely used today because it provides same level of security as older systems like RSA but with much smaller key sizes, which makes it faster and more efficient.

Some of the standard curves recommended are

|Curve name|Key size|
|---|---|
|NIST P-256|256-bit|
|secp256k1|256-bit|
|NIST P-384|384-bit|
|Curve25519|256-bit|
|Ed25519|256-bit|


## Elliptic Curve Discrete Logarithm Problem (ECDLP)
- If you have a point `P` on the curve and another point `Q = k x P` (where "x" means point multiplication)

- It is very easy to compute Q from P and k.

- But it is extremely difficult to find k if you have only given P and Q.

## key size in ECC
The 256-bit ECC key means totally three different but related things.

### Private key size
- The secret number d
- 256 bits (32 bytess)

### Public key size
- The point Q = d x G on the curve
- 32 or 33 bytes (compressed)/65 bytesss (uncompressed)

### Security level
- Approximate strength in symmetric bits (AES)
- ~128 bits of security

- 256-bit ECC ≈ AES-128 strength
- 384-bit ECC ≈ AES-192 strength
- 521-bit ECC ≈ AES-256 strength

### G in ECDLP
G is a fixed, publically known point on the elliptic curve that everyone agrees to use. It is chosen when the curve parameters are defined (SECP256k1, P-256, Curve25519, etc)

It has two crucial mathematical properties:
1. It has a huge prime order n
    - doing G+G+...+G (n times) gets you back to the point at infinity
    - n is ≈ 2²⁵⁶ for all 256-bit curves (a 256-bit prime)
2. It generates a very large prime-order subgroup
    - the points {G, 2G, 3G,..., (n-1)G} are all distinct and form the secure group we actually use.

Because of these properties, every valid private key d(1 <= d <= n) produces a unique public key Q = d x G.

## ECDSA – Elliptic Curve Digital Signature Algorithm
It is used for Authentication and integrity (digital signature). 

- Provides the same level of security as traditional DSA or RSA but with much smaller key sizes.

### signing a message
1. Hash the message: h = Hash(message)
2. Generate a random nonce `k` (Critical: Must be unique and secret per signature)
3. Compute point `R = k x G`, take x-coordinate -> `r = x_R mod n`
4. Compute `s = k⁻¹ × (h + d × r) mod n`
5. Signature = pair `(r, s)`, here r and s are two numbers between 1 and n-1. The complete signature is just the pair (r, s)

- Where `n` is the order of the elliptic curve group, more preciselly, the prime ordder of the base point G.`n` is a very large prime number such that `n x G = O` the point at infinity.

### Verification of message
1. Anyone with public key `Q` can verify.
2. Compute `u1 = h × s⁻¹ mod n`, `u2 = r × s⁻¹ mod n`
3. Compute point `P = u1 x G + u2 x Q`
4. If `P.x mod n == r`, then the signature is valid

`Note` : Never reuse the nonce `k` -> leads to private key recovery.


## ECDH - Elliptic Curve Diffie-Hellman
ECDH is a key exchange protocol that allows two parties to establish  a shared secret key over unsecured connection without ever sharing the secret itself.

It is based on ECDLP and is the elliptic curve version of classic diffie-Hellman protocol.

### ECDH working

1. Both parties agree on the same elliptic curve domain parameters
- A curve E over a finite field (eg., secp256r1, secp256k1, Curve25519, etc)
- A base point G on the curve
- The order `n` of G
- These parameters are public and can be standardized

2. Private and public keys
-   Alice picks a random private key
        `a` ∈ {1, 2, ..., n−1}
        Computes public key:
        `A = a x G`
- Bob picks a random private key:
        `b` ∈ {1, 2, ..., n−1}
        Computes his public key:
        `B = b × G`

3. Exchange public keys
    Alice sends A to Bob, Bob sends B to Alice (over insecure channel)

4. Compute shared secret
    - Alice computes:
        `S = a x B = a x (b x G)`
    - Bob computes:
        `S = b x A = b x (a x G)`
    
    Because multiplication is commutative both end up with the same point `S = a.b X G`

5. Derive symmetric key
    The x-coordinate of S (sometimes hashed) is used as the shared secret, which is then fed into a KDF (Key Derivation Function) to produce encryption/MAC keys.

`NOTE: ` The keys(public and private keys) which are used to generate the shared secret are static. These won't change between session of the communication.

### ECDH over DH
| Feature | ECDH (Elliptic Curve) | Classic DH (mod p) |
|---|---|---|
| Key size for ~128-bit security | 256 bits | ~3072 bits |
| Performance | Much faster, smaller keys | Slower, larger keys |
| Bandwidth | Small public keys (~32–65 bytes) | Large public keys (~384+ bytes) |


## ECDHE - Elliptic Curve Diffie-Hellman Ephemeral

ECDHE and ECDH are closely related. ECDHE is just ECDH with once critical addition: ephemeral (temporary) keys.

When the key exchange starts, the parties generate ephemeral key pairs. When the session ends, the parties invalidate the phemeral keys. For each session a new key pair is generated.


| Feature | ECDH (Static ECDH) | ECDHE (Ephemeral ECDH) |
|---|---|---|
| Full name | Elliptic Curve Diffie-Hellman (static) | Elliptic Curve Diffie-Hellman Ephemeral |
| Keys used | Long-term (static) private/public keys | Fresh, randomly generated (ephemeral) keys every session |
| Key pair reuse | Same key pair reused across sessions | New key pair generated for every handshake |
| Forward Secrecy | No | Yes |
| Authentication | Usually requires certificates or pre-shared keys | Usually requires certificates or pre-shared keys |
| Man-in-the-Middle protection | Only if public keys are authenticated | Only if ephemeral public keys are signed/authenticated |
| TLS cipher suite examples | TLS_ECDH_RSA_WITH_AES_128_GCM_SHA256 | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 |
| Vulnerable to future key compromise? | Yes — if long-term private key leaks, all past sessions can be decrypted | No — even if long-term key leaks later, past sessions remain safe |

