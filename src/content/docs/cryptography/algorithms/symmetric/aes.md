---
title: AES Overview
date: 16/11/2025
---

The Advanced Encryption Standard (AES) is a symmetric block cipher standardized by NIST in 2001. It operated on 128-bit blocks. And comes in thress official variants, differing only in key size.

|Key type|Key length|Rounds|security|
|---|---|---|---|
|AES-128 | 128 bits(16 bytes) | 10 | ~128-bit |
|AES-192 | 192 bits(24 bytes) | 12 | ~192-bit |
|AES-256 | 256 bits(32 bytes) | 14 | ~256-bit |

AES operates on a `4x4` byte array called the State (1 bytes = one block)

## Use of IV/NONCE in AES

### Key
- It is the cipher key (128, 192 or 256 bits)
- It is used to encrypt/decrypt the data
- This must be kept secret.
- Must be unique and secret
- 16, 24 or 32 bytes

### IV
- Initialization vector (always 128 bits = 16 bytes for AES)
- Provides semantic security by making the smae plaintext encrypt to different ciphertexts
- Can be public and sent in clear
- Must be unique and unpredictable for every new encryption with the same key.
- 16 bytes
- Used in AES-CBC, AES-CFB, AES-OFB

### NONCE (Number used once)
It is a random or sequentially increasing value that must be unique for every encryption performed with the same key.

- Can be any size (commonly 12 bytes in GCM)
- Never to be used with same key.
- Needs to be unique. Random is best
- Used in AES-GCM, AES-CTR, AES-CCM

NONCE is just like IV, but with more flexible size and randomness requirements.

If the same IV/NONCE is used under same key, confidientaility is completely lost. A single nonce reuse leaks the XOR of plaintexts, if one plaintext is known the adversary (opposite) can completely decrypt the other. 

Never, ever reuse  IV/NONCE with the same key. Generate a fresh random one (12 to 16 bytes) every single time.


### NONCE + Counter
The 128-bit block that is fed into the blcok cipher is split into two logical parts

```text
128-bit input to AES = [Nonce part] || [Counter part]
```

**NONCE** = The nonce part must be unique per message. 8-24 bytes in size
**Counter** = The part that increments for every block inside the same message (0, 1, 2, 3,...). 4-8 bytes in size

- With this we can encrypt very long messages (terabytes) without repeating any block input.

**Example :** Encrypting a 48-byte message with AES-CTR (96-bit nonce + 32-bit counter)

```text
Key (secret): same for whole session

Message 1 -> nonce = 6fb3c5a0f4e5d6c219e8a1b4 (12 random bytes, unique per message)

Block 1 (byte 0-15): AES-Encrypt(key, nonce || 00000001) -> keystream1
Block 2 (byte 0-15): AES-Encrypt(key, nonce || 00000002) -> keystream1
Block 3 (byte 0-15): AES-Encrypt(key, nonce || 00000003) -> keystream1

Ciphettext = plaintext XOR (keystream1 || keystream2 || keystream3)

```

For next message, use a completely different nonce and restart counter at 1 or 0.

If Nonce reuse is done, 
- Block 1 of message A and block 1 of message B use the exact same AES input -> exact same keystream.
- Attacker does `C1 XOR C2 = P1 XOR P2` -> instantly recovers XOR of the two plaintexts.
- From there plaintext recovery is trivial (same attack as famous "two-time pad")

- SO, never use the same nonce with the same key, even if counter is present.

#### Why nonce+counter used?
- To safely encrypt arbitratily long messages with only a short unique value per message
- One 12-byte raanddom nonce per message can encrypt petabytes without ever repeating a block input.

#### Why not use a pure 128-bit counter?
- A pure 128-bit counter would work perfectly, but you would have to store and transmit a full 16-byte counter that keeps growing forever.

Finally, `Nonce + Counter` is used in stream-like modes (CTR, GCM, ChaCha) so we can encrypt unlimited data with only a short unique-per-message value.

## Padding in AES

AES is a block cipher that always encrypts exaactly 16 bytes (128 bits) at a time. If plaintext is not exact multiple of 16 bytes, padding must be added before encryption and removed after decryption.

|Plaintext length|Bytes|Number of AES block|Need padding?|
|---|---|---|---|
|"Hello"|5|<1|Yes|
|16-byte password|16|1 block|No|
|25-byte message|25|1 full + 9 bytes|Yes|

- The modern AES modes such as AES-GCM, AES-CTR, ChaCha20-Poly1305 turns AES into a stream cipher. They work byte-by-byte, no padding is required.

