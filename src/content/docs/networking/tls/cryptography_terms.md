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
