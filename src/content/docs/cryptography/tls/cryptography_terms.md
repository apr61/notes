---
title: Cryptography Terms
date: 26/04/2025
---

## Asymmetric and Symmetric Encryption in TLS

### 1. **Asymmetric Encryption (Public/Private Key)**
**Used during the handshake phase.**

- **When?**
  - When the client verifies the server’s identity (using the server’s certificate containing its public key).
  - When establishing the shared secret/key via key exchange (like Elliptic Curve Diffie-Hellman — ECDHE).
  
- **How?**
  - In older TLS versions:  
    The client would encrypt a **pre-master secret** with the server’s public key — only the server with its private key could decrypt it.
    
  - In TLS 1.3:  
    They both use **asymmetric key exchange algorithms** (like ECDHE) to derive a shared secret without actually sending it over the network.

- **Why?**
  - Because asymmetric encryption allows secure key exchange and identity verification over an insecure network.
  - It’s computationally expensive, so it’s used only for the handshake.

---

### 2. **Symmetric Encryption (Shared Key)**
**Used after the handshake, for actual data transfer.**

- **When?**
  - After the shared secret (or session key) is derived during the handshake.
  
- **How?**
  - Both client and server use the **same symmetric keys** to encrypt and decrypt the data.

- **Why?**
  - Symmetric encryption is much faster and efficient for large amounts of data — ideal for continuous secure communication like transferring web pages, images, or form data.

---

### Quick Summary Table:

| Aspect                   | Asymmetric Encryption           | Symmetric Encryption             |
|:------------------------|:--------------------------------|:--------------------------------|
| 📌 When used             | During handshake (key exchange, authentication) | After handshake (data transfer) |
| 🔑 Keys involved         | Public and Private Key pair      | Single shared secret key         |
| ⚙️ Algorithms example     | RSA, ECDSA, ECDHE                | AES, ChaCha20                    |
| ⚡ Speed                  | Slower                           | Much faster                      |
| 🔒 Security purpose       | Identity verification, secure key exchange | Secure data transmission        |

---

## AEAD

AEAD stands for 
> Authenticated Encryption with Associated Data

We are considering TLS 1.2 and TLS 1.3 as example

### Without AEAD

TLS 1.2 often used 

> Encrypt + HMAC

For example

> AES-CBC + HMAC


Workflow:

```txt
plaintext -> HMAC -> Append MAC -> Encrypt
```

Receiver:

```txt
Decrypt -> Verify MAC
```

Encryption and integrity are two separate operations.

### With AEAD

AEAD combines both into one algorithm

```txt
Plaintext -> AEAD encrypt -> Ciphertext -> Authentication Tag
```

#### Receiver

```txt
AEAD decrypt -> Tag verified? 

YES -> Plaintext
NO -> Reject
```

One operation provides:
1. Confidentiality
2. Integrity
3. Authenticity

### Associated Data in AEAD

Sometimes information is not encrypted but still needs integrity protection.

For example, TLS record header:

1. Content Type
2. Protocol Version
3. Record Length

These fields remain visible on the wire.

AEAD protects them from modification.

Conceptually AEAD works in this way

```txt
AEAD_Encrypt(
  plaintext,
  associated_data,
  Key,
  IV
)
```

The associated data is authenticated but not encrypted.
If associcated data is modified, authentication fails.

