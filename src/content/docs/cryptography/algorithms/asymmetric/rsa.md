---
title: RSA Overview
Date: 07/12/2025
---

# What is RSA?
RSA (Rivest-Shamir-Adleman) is an asymmetric(public key) cryptographic algorithm.
It uses
- One key for encryption/decryption -> Public key
- Another key for decryption/signature -> private key

RSA is used for
- Encrypting small data (like symmetric keys)
- Digital Signatures
- Key exchange (TLS handshake)
- Secure email (S/MIME, CMS)
- Cryptographic tokens

## How RSA works internally
RSA security is based on math problem
- Given N = p x q (product of two large primes), it is easy to multiply p and q but extremly hard to factor N.
- Finding p and q from N is extremely hard

### Common RSA key lengths

| RSA Key Length | Security Level             | Used For                 |
| -------------- | -------------------------- | ------------------------ |
| **1024 bits**  | Weak today (can be broken) | Not recommended          |
| **2048 bits**  | Good security              | Default for most systems |
| **3072 bits**  | Strong                     | Long-term security       |
| **4096 bits**  | Very strong                | High-security apps       |
| **8192 bits**  | Overkill / slow            | Rarely used              |


## RSA key-pair generation

#### `Step 1` - Choose two large random prime numbers

```text
p, q (each 1024 bits for RSA-2048)
```

#### `Step 2` - Compute modulus
```text
N = p x q
```
- N is part of public and private key

#### `Step 3` - Compute Euler's totient
```text
φ(N) = (p−1)(q−1)
```

#### `Step 4` - Choose public exponent `e`
The public exponent `e` is typically `65537`
It is used for below reasons
- Fast exponentiation
- Hard to attack
- Widely standardized

#### `Step 5` - Compute private exponent `d`
```text
d = e⁻¹ mod φ(N)
```
`d` is a modular multiplicative inverse.

So the keys are:
##### Public key = (N,e)
##### Private key = (N, d)
and optional CRT params: p, q, dp, dq, qinv

### RSA key-gen example

| Component            | Value        |
| -------------------- | ------------ |
| p                    | 61           |
| q                    | 53           |
| N = p × q            | 3233         |
| φ(N)                 | 3120         |
| e (public exponent)  | 17           |
| d (private exponent) | 2753         |
| Public Key           | (17, 3233)   |
| Private Key          | (2753, 3233) |

### CRT params
CRT = Chinese Remainder Theorem

When decrypting or signing, RSA normally needs to compute
```text
m = c^d mod N
```

This operation is slow because:
- `d` is large
- `N` is large (2048-bit or 4096-bit)

To speed things up, RSA uses CRT to break this into two smaller exponentiations - one modulo `p`, one module `q`

The CRT params includes
- dp = d mod (p-1)
- dq = d mod (q-1)
- qinv = q⁻¹ mod p 

#### Why RSA private keys store dp, dq, qinv?
- They speed up private key oeprations
- They are required for CRT reconstruction

A PEM/DER encoded private and public key consists like this

#### PEM public key
```text
Modulus (n)
Exponent (e)
```

#### PEM private key
```text
Modulus (n)
PublicExponent (e)
PrivateExponent (d)
Prime1 (p)
Prime2 (q)
Exponent1 (d mod (p-1))
Exponent2 (d mod (q-1))
Coefficient (q^{-1} mod p)
```

## RSA encryption/decryption

RSA's core mathematical property
```text
(m^e mod N)^d mod N = m
(m^d mod N)^e mod N = m
```
where
- `m` is message
- `e` is public exponent
- `d` is private exponent
- `N` is modulus

### RSA encryption process
- RSA uses public key for encryption
- If we are encrypting message `m` then
```text
ciphertext = m^e mod N
```
- m is not the raw message, it must be padded first

#### `Step 1` - Convert message into bytes
"HELLO" -> `48 45 4C 4C 4F"

#### `Step 2` - Add padding
For PKCS#1 v1.5
```text
EM = 0x00 || 0x02 || random nonzero bytes || 0x00 || message
```

For OAEP:
- Use hash
- Mask Generation Function (MGF)
- XOR masks
- Strong padding

#### `Step 3` - Convert padded block EM into integer m
#### `Step 4` - Perform RSA public-key operation
```text
c = m^e mod N
```

where `c` is the cipher text

### RSA decryption process
- RSA uses private key for decryption
- For a given ciphertext `c`

```text
m = c^d mod N
```

#### `Step 1` - Peform RSA private key operation
```text
EM = c^d mod N
```

#### `Step 2` - Remove padding
For PKCS#1 v1.5
- Perform PKCS#1 structure verification
- Must begin with `00 02`
- Random padding bytes untill `00`

For OAEP:
- Unmask using MGF
- Validate hash

- Original message is extracted

## RSA sign/verify
RSA signatures are based on the same as RSA enbcryption, but in reverse order.
- Signing uses the private key `d`
- Verify uses the public key `e`

This is possible because of below property
```text
(m^d mod N)^e mod N = m   (if m < N)
```

- RSA never signs the raw messages, it signs the hash that is wrapped in ASN.1 structure (PKCS#1 v1.5) or padded using RSA-PSS.

### RSA signing 
Private key used for signing

#### `Step 1` - Calculate message hash
```text
H = SHA-256(message)
``` 

#### `Step 2` - Wrap hash in DigestInfo (ASN.1)
For PKCS#1 v1.5, RSA signs this structure
```text
DigestInfo = ASN1_encode( OID_of_SHA256 + H )
```
- OID Hash Algorithm is used to tell the verifier, what is the hashing algorithm used when signing.

#### `Step 3` - Pad using PKCS#1 v1.5
Construct a block of length equal to RSA modulus size
```text
EM = 0x00 || 0x01 || FF FF FF ... FF || 0x00 || DigestInfo
```

Example for 2048-bit RSA
- Total = 256 bytes
- FF padding  = 256 - 3 - len (DigestInfo)

#### `Step 4` - Perform RSA private key operation
```text
S = EM^d mod N
```
Where `S` is RSA signature

### RSA verification
Public key is used in RSA verification

#### `Step 1` Compute message hash
```text
H = SHA-256(message)
```

#### `Step 2` - Reverse RSA using public exponent
```text
EM' = S^e mod N
```
This recovers the padded DigestInfo that the signer produced

#### `Step 3` - Check padding
Verify PKCS#1 v1.5 padding
- EM' begins with `0x00 01 FF FF ... 00`
- FF padding length is valid

#### `Step 4` - Parse ASN.` DigestInfo
Extract below values
- Hash algorithm OID
- Digest value

#### `Step 5` - Compare digests
```text
if extracted_digest == H:
       signature is valid
else:
       invalid
```

If calculated_hash or extracted_digest match, signature is valid.

### Why hashing is required?
- RSA can only sign num,bers < N
- Hashing makes input fixed-size
- Signing large message directly is insecure and too slow
- Hash defines message integrity

## Padding algorithms used in RSA