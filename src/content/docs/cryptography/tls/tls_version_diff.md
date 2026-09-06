---
title: TLS version differences
date: 06/09/2026
---


## TLS 1.1 VS TLS 1.2 VS TLS 1.3

| Topic                    | TLS 1.1           | TLS 1.2              | TLS 1.3                         |
| ------------------------ | ----------------- | -------------------- | ------------------------------- |
| **Key exchange**         | RSA, DH, ECDH     | RSA, DH, ECDH, ECDHE | **ECDHE / PSK**                 |
| **RSA key exchange**     | ✅                 | ✅                    | **❌ Removed**                   |
| **Forward secrecy**      | Optional          | Optional             | **Normally provided**           |
| **Cipher algorithms**    | CBC commonly used | CBC + AEAD           | **AEAD only**                   |
| **Key derivation**       | PRF               | PRF                  | **HKDF**                        |
| **Handshake latency**    | ~2 RTT            | ~2 RTT               | **1 RTT**                       |
| **0-RTT**                | ❌                 | ❌                    | **✅**                           |
| **Handshake encryption** | Later             | Later                | **Encrypted after ServerHello** |
| **Renegotiation**        | ✅                 | ✅                    | **❌ Removed**                   |
| **Cipher suites**        | Complex           | Complex              | **Much simpler**                |


## TLS 1.2 VS TLS 1.3

TLS 1.2 

1. Introduced more flexible hash/signature algorithm negotiation.
2. Uses SHA-256-based PRF by default instead of older SHA-1/MD5 construction.
3. Added/supports AEAD ciphers such as AES-GCM.

> TLS 1.2 improved cryptography but retained the TLS architecture.

## 1-RTT vs 2-RTT

RTT = Round-Trip Time, is the time for a message to travel from client -> server and response to come back server -> client.

### How does a TLS 1.2 2-RTT looks like?

```text
                    RTT 1
Client                                      Server
  |                                           |
  | -------- ClientHello ------------------> |
  |                                           |
  | <------- ServerHello ------------------- |
  | <------- Certificate -------------------- |
  | <------- ServerKeyExchange --------------|
  | <------- ServerHelloDone ----------------|
  |                                           |
```

Here, one complete round trip has been completed. (client -> server -> client)

```text
                    RTT 2
Client                                      Server
  |                                           |
  | -------- ClientKeyExchange ------------>  |
  | -------- ChangeCipherSpec --------------> |
  | -------- Finished ----------------------> |
  |                                           |
  | <------- ChangeCipherSpec --------------- |
  | <------- Finished ----------------------- |
  |                                           |
```

Here, second complete round trip has been completed. (client -> server -> client)

After this, client and server can send application data.


### How does a TLS 1.3 1-RTT looks like?

```text
                    RTT 1
Client                                      Server
  |                                           |
  | -------- ClientHello ------------------> |
  |          + key_share                      |
  |                                           |
  | <------- ServerHello ------------------- |
  |          + key_share                      |
  | <------- EncryptedExtensions ------------|
  | <------- Certificate --------------------|
  | <------- CertificateVerify --------------|
  | <------- Finished -----------------------|
  |                                           |
  | -------- Finished ---------------------->|
  | -------- Application Data -------------->|
```

As soon as the, server sends Finished message (RTT 1 is completed) and Client will send application data after Finished. 

## Interview points

### Why TLS 1.3 is more secure?

- Removed obsolute and risky cryptographic options
- Requires AEAD for record protection
- Removed RSA key transport and static DH.
- Uses ephemeral key exchange to provide forward secrecy
- Also encrypts most of handshake

### Why TLS 1.3 is faster?

- Completes handshake in 1-RTT instead of 2-RTT.
- Supports 0-RTT for resumed connections, allowing client to send early application data.
- 0-RTT is vulnerable to replay, it should be used only for replay-safe operations.


### Ciphersuite reading

#### TLS 1.2

```text
TLS_<KEY_EXCHANGE>_<SIGNATURE_ALGO>_WITH_<SYMMETRIC_ALGO>_<HASH_ALGO>
```

"KEY_EXCHANGE"
  - DHE, ECDH, ECDHE

"SIGNATURE_ALGO"
  - RSA, ECDSA

"SYMMETRIC_ALGO"
  - AES-CBC, AES-GCM, etc..

"HASH_ALGO"
  - SHA-1, SHA-256, SHA-384

eg:,

```text
TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDH_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
```

### TLS 1.2 or lesser version (with RSA Key transport)

```text
TLS_<SIGNATURE_ALGO>_WITH_<SYMMETRIC_ALGO>_<HASH_ALGO>
```

Here, Key exchange is ommited. Because RSA is used for key transport

eg:,

```text
TLS_RSA_WITH_AES_128_GCM_SHA256
TLS_RSA_WITH_AES_128_CBC_SHA256
```
