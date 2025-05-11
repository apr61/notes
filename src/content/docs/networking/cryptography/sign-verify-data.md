---
title: Sign And Verify Data
date: 11/05/2025
---


## Asymmetric Sign and verify using OpenSSL

### Signing of data

#### 1. Hash of data

- OpenSSL computes cryptographic hash of the data to be signed using a specified algorithm (eg. SHA-256)

#### 2. Sign of Hash

- The hash is encrypted with the private key to create a digital signature.

The private key is used to perform an encryption-like operation on the hash (mathematically, RSA signing is signature = hash^private_key mod N)

```sh
# Genrate private key
openssl genrsa -out private_key.pem 2048

# Get the publlic key from the private key
openssl rsa -in private_key.pem -pubout -out public_key.pem
```


```sh
# Sign data 
openssl dgst -sha256 -sign private_key.pem -out signature.bin data.txt
``` 

### Verification of data

#### 1. Compute hash of original data

- Hash of the data is recomputed using the same hashing algorithm.

#### 2. Decrypt the signature

- The signature is decrypted using the public key.

By applying the public key to the signature (mathematically, decrypted_hash = signature^public_key mod N).

- The result is the original hash that was signed with the private key.

#### 3. Compare hashes

- OpenSSL compares the decrypted hash with the computed hash from data.
- If they match signature is valid and data is untampered.
- if they don't match, data is tempared or signature is invalid or wrong public key.

```sh
openssl dgst -sha256 -verify public_key.pem -signature signature.bin data.txt
```

#### Why hashing?
- Hashing ensures the signature is compaact. Signing a fixed hash is more efficient than signing large data.
- It also insures integrity, any changes in data will also change the hash, causing Verification to fail.


### RSA vs ECC

RSA signing involves padding the hash (per PKCS#1 standards) before encrypting it with private key.
Verification reverses this, extracting the hash after decrypting with public key.

#### What is padding here?

RSA signing invloves hashing the data and signing hash with private key. But hash alone is not directly encrypted.
It's padded according to specific scheme before RSA operation.

1. Securtiy
    - Padding prevents certain cryptographic attacks such as chosen-ciphertext attack by adding structure and randomness to data.

2. Fixed length
    RSA operates on fixed-size inputs determined by the key size, eg., 2048 bits. A hash is (256 bits for SHA256) 
    is much more smaller than the RSA modulus, so padding extends the data to required length.

3. Standardization
    Padding ensures interoperability by following standards like PKCS#1, so that signature can be verified by other systems.

4. Without padding signing a raw hash with RSA is insecure (vulnerable to attacks like forging signatures) 

#### Padding schemes PKCS#1 v1.5 

##### Padding structure

The hash is combined with metadata (eg., the hash algorithm identifier) and padded to match RSA key size.

Padded data typically looks like

```sh
00 | 01 | PS | 00 | DigestInfo
```

- **00 | 01** : Fixed bytes to indicate PKCS#1 v1.5 padding
- **PS** :  A string of **0xFF** bytes (Padding space) to fill space.
- **00** : Separator byte
- **DigestInfo** : The hash algorithm ID (eg., SHA256 OID) + the hash itself.

- The total length matches the RSA modulus (eg., 256 bytes for a 2048-bit key)

##### Padding Verification

1. Signature is decrypted using the public key to recover the padded data.
2. OpenSSL verifies the padding structure is valid.
3. Hash and it's algorithm ID are extracted from the padded data.
4. Extracted hash is compared against the hash of input data.
5. If padding is invalid or hashes don't match verification fails.


### ECDSA

ECDSA (Elliptic Curve Digital Signature Algorithm) is cryptographic algorithm for creating and verifying digital signatures using Elliptic Curve Cryptography (ECC).

ECDSA is based on mathematics of elliptic curves, which provide stronger security with smaller key sizes.

- A 256-bit ECDSA key is roughly equivalent to a 3072-bit key size.


#### ECDSA signing 
- Computes a hash of data using hashing algorithms (eg., SHA256)
- Use private key to generate a signature (r, s) based on the hash and a random nonce.

#### ECDSA verification
- Recompute the hash of data.
- Use public key to check if the signature (r, s) is valid for the hash.

Unlike RSA, ECDSA doesnot use padding like PKCS#1 or PSS. It directly signs the hash and signature is a pair of integers.

#### 1. Generate the key-pair

```sh

# Generate private key
openssl ecparam -genkey -name prime256v1 -out private_key.pem

# Extract the public key
openssl ec -in privatekey.pem -pubout -out public_key.pem 

```

#### 2. Sign the data

```sh

openssl dgst -sha256 -sign private_key.pem -out signature.bin data.txt

```

#### 3. Verify the data

```sh
openssl dgst -sha256 -verify public_key.pem -signature signature.bin data.txt
```


### Why ECDSA?
- Smaller signature sizes (e.g, ~70 bytes for prime256v1 vs 256 bytes for 2048-bit RSA).
- Faster verification, critical for resource-constraint devices.

