---
title: TLS 1.2
date: 26/04/2025
---


## TLS 1.2 Handshake (Full Process — No Client Auth)

---

### 1 **ClientHello**
Client sends:
- Supported TLS version  
- List of supported cipher suites (algorithms for key exchange, encryption, hashing)  
- A random number (Client Random)  
- Optional session ID (for session resumption)

**Purpose:** Initiates connection, proposes cryptographic options.

---

### 2 **ServerHello**
Server replies with:
- Chosen TLS version  
- Chosen cipher suite  
- A random number (Server Random)  
- Optional session ID (if resuming)

**Purpose:** Chooses final protocol settings for the session.

---

### 3 **Server Certificate**
Server sends:
- Its X.509 digital certificate (containing its public key)

**Purpose:** Authenticates server identity.  
**🔐 Asymmetric Encryption Usage:** This public key may be used (in RSA key exchange) to encrypt the premaster secret.

---

### 4 **ServerKeyExchange** (only for ECDHE/DHE)
If using an ephemeral key exchange method:
- Server sends its ephemeral public key (e.g. ECDHE public key)

**Purpose:** Provides data for key agreement.

---

### 5 **CertificateRequest** (optional)
If the server wants to authenticate the client (mutual TLS):
- Server sends a request for client’s certificate.

**Purpose:** Initiates client authentication (skipped in normal one-way TLS)

---

### 6 **ServerHelloDone**
Signals server is done sending handshake data.

---

### 7 **Client Certificate** (optional)
If requested, client sends its own certificate.

---

### 8 **ClientKeyExchange**
Now, client sends:
- **RSA Key Exchange:** A random **Premaster Secret**, encrypted with the server’s public key from its certificate.  
**OR**
- **ECDHE Key Exchange:** Its own ephemeral public key.

**Purpose:** Establish shared secret for symmetric encryption.

---

### 9 **CertificateVerify** (if client sent a cert)
Proves client owns private key of the certificate it sent.

---

### 10 **ChangeCipherSpec (Client)**
Client sends a special message telling server:  
**"From now, everything I send will be encrypted with the newly negotiated symmetric keys."**

**Symmetric Encryption starts here for the client → server messages.**

---

### 11 **Finished (Client)**
Client sends a hash of the entire handshake so far, encrypted with the symmetric key.  
**This ensures integrity and confirms key agreement.**

---

### 12 **ChangeCipherSpec (Server)**
Server sends its own ChangeCipherSpec, meaning it too will now encrypt all further messages.

**Symmetric Encryption starts here for the server → client messages.**

---

### 13 **Finished (Server)**
Server sends its own hash of the handshake, encrypted with the symmetric key.

---

### 14 From here:  
**Secure application data flows using symmetric encryption**  
with session keys derived from the shared secret.

---

### Quick Diagram

```
Client                               Server
  | -- ClientHello -------------------->
  |                                     |
  | <-- ServerHello -------------------
  | <-- Certificate -------------------
  | <-- ServerKeyExchange (if ECDHE) --
  | <-- CertificateRequest (optional) -
  | <-- ServerHelloDone ---------------
  |                                     |
  | -- Certificate (optional) --------->
  | -- ClientKeyExchange ------------->
  | -- CertificateVerify (if needed) -->
  | -- ChangeCipherSpec ------------->
  | -- Finished --------------------->
  |                                     |
  | <-- ChangeCipherSpec ---------------
  | <-- Finished ----------------------
  |                                     |
[ Secure Application Data ]
```

---

### Where Asymmetric and Symmetric Encryption Happen:

| Encryption Type | Where it’s Used |
|:----------------|:----------------|
| 🔐 **Asymmetric (Public/Private Key)** | Server certificate exchange, verifying identities, encrypting premaster secret (RSA) |
| 🔒 **Symmetric (Shared Key)** | After ChangeCipherSpec — for application data, Finished messages |

---

### Key Exchange Methods Supported in TLS 1.2:
- **RSA** (Premaster secret encrypted with server’s public key — no forward secrecy)
- **DHE / ECDHE** (Diffie-Hellman — forward secrecy via ephemeral key pairs)

---


### PCAP logs

#### TLS 1.2 One Way TLS

![TLS 1.2 PCAP logs](/images/tls1_2_pcap.png)

---

![TLS 1.2 PCAP logs](/images/tls1_2_tcp.png)

---

#### TLS 1.2 Two Way TLS