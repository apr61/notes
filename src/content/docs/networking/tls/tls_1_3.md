---
title: TLS 1.3
date: 26/04/2025
---

## One-Way TLS Handshake (Server Auth only)

### 1. **ClientHello**
   - Client sends:
     - Supported TLS versions
     - List of supported cipher suites
     - Random number (client_random)
     - Key share (for key agreement — e.g., ECDHE parameters)
     - (Optional) Server Name Indication (SNI)
  
### 2. **ServerHello**
   - Server responds with:
     - Chosen TLS version (TLS 1.3)
     - Chosen cipher suite
     - Random number (server_random)
     - Key share (for key agreement)
  
### 3. **Key Exchange and Shared Secret Generation**
   - Client and Server use exchanged key shares (ECDHE) to compute a **shared secret**.

### 4. **Server Certificate**
   - Server sends its **digital certificate**.
   - (Optional) **CertificateVerify** message proving the server owns the private key corresponding to the cert.
  
### 5. **Finished Messages**
   - Server sends a **Finished** message (HMAC over handshake messages using derived keys).
   - Client verifies it.
   - Client then sends its own **Finished** message.
   - Server verifies it.

### 6. **Secure Communication Begins**
   - Application data (HTTP/2, etc.) is now exchanged securely.

---

## 📘 Two-Way TLS Handshake (Mutual Auth)

**Same as one-way, with one extra step for client certificate verification.**

### 1-4. **Same as One-Way TLS**

### 5. **Server requests client certificate**
   - Server sends a **CertificateRequest** message during handshake.

### 6. **Client sends its certificate**
   - Client sends:
     - Its **digital certificate**
     - **CertificateVerify** message (proof of private key ownership)
  
### 7. **Finished Messages**
   - Same as above: server and client exchange and verify **Finished** messages.

### 8. **Secure Communication Begins**
   - Both parties verified each other’s identity — secure, mutual trust.

---

### 📑 Quick Visual Summary

#### 📗 One-Way TLS  
```
Client         →       Server
  |  ClientHello       |
  |  ← ServerHello     |
  |  ← ServerCertificate |
  |  ← ServerFinished  |
  |  ClientFinished    |
  |  ↔ Secure Data     |
```

#### 📘 Two-Way TLS  
```
Client         →       Server
  |  ClientHello       |
  |  ← ServerHello     |
  |  ← ServerCertificate |
  |  ← CertificateRequest |
  |  ClientCertificate |
  |  ClientFinished    |
  |  ← ServerFinished  |
  |  ↔ Secure Data     |
```

---

### Pcap logs of TLS 1.3

![TLS 1.3 pcap](/public/images/tls1_3_pcap.png)

---

![TLS 1.3 pcap](/public/images/tls1_3_tcp.png)

#### Breakdown: What you’ll see in the PCAP (without decryption)

#### Visible Messages:

- ClientHello
- ServerHello
- EncryptedExtensions
- (Optionally) CertificateRequest (if mutual TLS is requested)
- ChangeCipherSpec (in some implementations — but it's obsolete in TLS 1.3)
- Finished messages
- Application Data frames (encrypted)

#### Hidden / Encrypted Messages:

After ServerHello, most of the handshake messages including:
- Server Certificate
- CertificateVerify
- Client Certificate (in 2-way TLS)
- Client CertificateVerify
- Key exchange details (KeyShare, etc.)

are all encrypted inside a message frame called **EncryptedHandshakeMessage**.

