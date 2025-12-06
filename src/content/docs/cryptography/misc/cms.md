---
title: CMS Overview
date: 04/12/2025
---

CMS stands for Cryptographic Message Syntax. It is a standard format used to sign, encrypt, authenticate and digest data. It is the sucessor to PKCS#7 and is widely used in email security (S/MIME), secure file exchange and certificate-based systems.

## CMS provides
|Feature|Description|
|---|---|
|Encryption|Encrypt data with symmetric keys, which are themselves encrypted with receipents public keys.|
|Digital signatures|Sign data using private key, which includes signature of the signer certificates|
|Message Digests|Provide integrity using hashing|
|Authenticated Enveloped Data|Encryption + authentication (AEAD)|
|Compression|Optionally data compression before protection|

## CMS Content types
CMS defines multiple content types:
1. Data
2. Signed data (Used for digital signatures)
3. Enveloped Data (Used for encryption)
4. DigestedData
5. EncryptedData
6. Authenditcated Data
7. AuthEnveloped Data

## CMS data encryption/decryption

### CMS data encryption process

#### `Step 1` -  Read recipient certificates
For each `{recipent.pem}` we supply
- OpenSSL loads the X509 certifcate
- Extract the recipient public key (Usually RSA or EC)

#### `Step 2` - Generate a random Content Encryption Key(CEK) 
- This CEK is used to encrypt the plaintext message

#### `Step 3` - Content encryption algorithm
- Openssl sets the AES encryption algorithm.
- Like AES-128, AES-256.
- Openssl uses AES-CBC by default

#### `Step 4` - Encrypt the content
- Openssl will encrypt the content using CEK and content encryption algorithm

#### `Step 5` - Encrypt CEK for each receipient     
- For each receipient, the CEK is encrypted with the recipient public key

    ##### RSA key sharing
    - For RSA, CEK is directly encrypted with the recipient public key
    - By default openssl uses `RSA PKCS#1v1.5` for padding
    - We can change it to `RSA-OAEP`

    ##### EC key sharing (ECDH)
    - If certificates use EC key as KeyAgreement usage, openssl selects ``CMS Key Agreement RecipientInfo (KARI)``

        ###### `Step A` - Generate ephemeral EC keypair
        ```c
        sender_ephemeral = EC_KEY_new()
        EC_KEY_generate_key(sender_ephemeral)
        ```

        ###### `Step B` - Compute shared secret with recipient public key
        ```c
        Z = ECDH_compute_key(recipient_pubkey, sender_ephemeral_private)
        ```

        ###### `Step C` - Derive KEK (Key Encryption Key) from shared secret
        Using `X9.63-KDF` or `Concat-KDF`:
        ```c
        KEK = KDF(Z || ukm || algorithmID)
        ```

        ###### `Step D` - Wrap the CEK with the KEK (AES key wrap)
        From RFC 3394
        ```c
        wrappedCEK = AES_key_wrap(KEK, CEK)
        ```
        
        ###### `Step E` - Store the ephemeral public key inside CMS
        recipient will use this to compute shared secret during decryption

#### `Step 6` - ASN.1 Encoding
- The content is encoded in DER
- PEM encoding will be performed, if requested.
- The encoded data is written to a file or stdout


### CMS data decryption process
#### 1. Read the CMS file, perform DER decode and construct CMS internal objects

#### 2. Match the correct RecipientInfo
CMS may contain multiple recipients:
- RSA recipients (KeyTransRecipientInfo)
- ECDH recipients (KeyAgreeRecipientInfo)
- KEK recipients (KEKRecipientInfo)

Openssl identifies which one to use by compairing
```c
RecipientInfo.rid  == certificate.subject+serial
```

Once matched, Openssl knows
    1. What key type to use (RSA, EC)
    2. What algo to use (RSAES-PKCS1-v1_5, RSA-OAEP, ECHE structure)

#### 3. Recover the CEK
- The CEK was originally generated and encrypted for each recipient. Now recipient tries to extract the CEK using the private key.

##### 1. RSA Key Transport
    - The Recipient private key is used to decrypt the CEK directly.
    - RSA PKCS#1 v1.5 padding mode will be used, else RSA-OAEP if configured.
    - After this CEK (AES Key) is recovered

##### 2. ECDH Key Agreement
KeyAgreementInfo is more complex.

```text
originatorPublicKey      → ephemeral EC pubkey
ukm                      → optional user keying material
recipientEncryptedKeys[] → contains wrapped CEK
```

###### `Step A` - Compute shared secret
- Recipient uses it's EC private key (long-term) and Sender's ephimeral public key

```c
Z = ECDH_compute_key(ephemeral_pubkey, recipient_private_key)
```

###### `Step B` - Derive KEK using KDF
- The KEK is dervied using `X9.63-KDF` or `Concat-KDF`

```c
KEK = KDF(Z || ukm || algorithmID)
```

This KEK is usually AES-128 or AES-256

###### `Step C` - Unwrap CEK
- CEK was wrapped using AES key wrap (RFC 3394)

```c
CEK = AES_key_unwrap(KEK, encryptedKey)
```
- After this step CEK is recovered

#### 3. Decrypt the Encrypted content using CEK
- Using the CEK, encrypted content is decrypted.
- For GCM/CCM modes, authentication tags are checked. If tag mismatch -> decryption fails.

## CMS data sign/verify

### CMS signing
CMS signing creates a `SignedData` structure that provides
- Integrity (Data cannot br tampered)
- Authentication (the signer's certificate is included)
- Optionally: detached or attached signature

- The signer's prvivate key is used (RSA/ECDSA/EdDSA)
- The Signed attributes (timestamp, digest, etc.)
- A hash of the message

#### CMS Signing Process

##### `Step 1` - CMS type is chosen
 For signing `SignedData` CMS type is chosen

##### `Step 2` - Compute Message Digest (hash)
- The message is hashed usign SHA256, SHA-384 or user selected algorithm
    
##### `Step 3` - Form "Signed Atrtributes"
- CMS doesnot directly sign the `hash(data)`
- Instead, it signs a structure of attributes, 
    1. Message-digest (mandatory)
    2. cmsVersion
    3. signing time
    4. contenty-type
- The above data is DER encoded and signed

##### `Step 4` - Create Signature (RSA/ECDSA/EdDSA)
- The signature is computed by using the signer's private key and DER encoded Signed Attributes.

##### `Step 5` - Add certificates
- CMS attaches the certificate chain unless `-nocerts` is used

##### `Step 6` - Pack everything into SignedData ASN.1 structure
- The SignedData object is assembeled in ASN.1 DER or PEM
- For attached signature, data is put inside the `EncapsulatedContentInfo`
- For detached signature, content is left outside

### CMS verification
CMS verification checks:
    - Signature validaity
    - Message integrity
    - Certificate validity
    
#### CMS verification process
##### `Step 1` - Parse CMS SignedData structure
- Openssl checks the incoming CMS file for DER or PEM encoded ASN.1 object.
- The CMS parser loads the SignedData and gets 
    1. content (or uses detached content)
    2. signerInfos list
    3. certificate chain
    4. attributes

##### `Step 2` - Determine content
- For attached signatures, content will be inside `EncapsulatedContentInfo.eContent`
- For detached signature, content must be provided by the caller

##### `Step 3` - Compute message digest
- The hashing algorithm is retrived from the SingedData structure.
- The hash of content is calculated

##### `Step 4` - Extract signed ceritificates
- SignedAttrs are extracted from SignedData structure, which are namely
    1. Content-type
    2. Message-digest
    3. Signing-time
    4. CMS version
    5. SigningCertificate

- CMS requires that the signer signs the DER-encoded signedAttrs, not the raw content

##### `Step 5` - Compare "message-digest" attribute
- Openssl compares the message-digest of signedAttr with hash calculated in ##### `Step -3`
- If these do not match -> CMS_DIGEST_MISMATCH is returned.
- The message-digest comparision happens first then the signature verificaition because Signature verification is expensive for (RSA/ECDSA). 
- If digest verification fails, then there is no point in verifing the signature.

##### `Step 6` - DER Encoded Signed Attributes
- CMS performs DER_Encode on the signedAttrs. Because every byte matters, any re-ordering breaks teh signature.
- This step is needed because signedAttrs are in-memory structures (not bytes). A signature must operate on bytes.
- Only DER guarantees a canonical byte repesentation.
- Re-encoding ensures verification uses the exact same bytes the signer used.

##### `Step 7` - Signature verification using public key
For perfroming signature verification, the library loads

```text
signatureAlgorithm  (ex: rsaEncryption, ecdsa-with-SHA256, ed25519)
signature           (OCTET STRING)
public key          extracted from certificate
```
- The DER_attrs from `Step 6` are used for signature verification using public key.
- This step actually checks if the signers private key was used to sign the attributes.

##### `Step 8` - Certificate verification
- This is a optional step, if enabled below checks are done
    1. Build certificate chain
    2. Validate issuer signature
    3. Validate
        - certificate validity time
        - BasicConstraints
        - KeyUSage for digitalSignature
        - ExtentedKeyUsage for emailProtection or codeSigning
    4. CRL/OCSP checks if needed

#### Final verification result
If all the following pass:
    - digest match
    - signed attributes OK
    - signature over signedAttrs OK
    - certificate validation OK
    - structure Ok

    Then verification of CMS SignedData succeeds.

## Examples using OpenSSL cmds or C code


