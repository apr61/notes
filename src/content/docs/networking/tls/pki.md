---
title: Create your own PKI
date: 14/12/2024
---

Creating your own PKI these commands can be used.

**Library** - Openssl

**Encryption Algorithm** - RSA

## ROOT CA

### Folder structure
```
root/
├── certs/
├── crl/
├── newcerts/
├── private/
├── index.txt
├── crlnumber
└── openssl.cnf
```

```sh
touch ./root/crlnumber
echo "01" > ./root/crlnumber
```

```INI
# openssl.cnf

[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ./root
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
private_key       = $dir/private/ca.key.pem
certificate       = $dir/certs/ca.cert.pem
crlnumber         = $dir/crlnumber
crl               = $dir/crl/ca.crl.pem
default_md        = sha256
policy            = policy_strict
default_days      = 3650
unique_subject    = no
email_in_dn       = no
rand_serial       = $dir/private/.rand
default_crl_days  = 30

[ policy_strict ]
countryName            = match
stateOrProvinceName    = match
organizationName       = match
organizationalUnitName = optional
commonName             = supplied
emailAddress           = optional

[ req ]
default_bits        = 4096
default_keyfile     = private/ca.key.pem
default_md          = sha256
distinguished_name  = req_distinguished_name
x509_extensions     = v3_ca

[ req_distinguished_name ]
countryName             = Country Name (2 letter code)
stateOrProvinceName     = State or Province Name (full name)
organizationName        = Organization Name (eg, company)
commonName              = Common Name (e.g., server FQDN or YOUR name)

[ v3_ca ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints       = critical,CA:true
keyUsage               = critical, digitalSignature, cRLSign, keyCertSign
crlDistributionPoints  = URI:http://pki.pradeep.dev/root_ca.crl

[ v3_intermediate_ca ]
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
extendedKeyUsage = serverAuth, clientAuth
authorityKeyIdentifier = keyid:always, issuer
subjectKeyIdentifier = hash
```

### Generate private key
```sh
openssl genrsa -aes256 -out root/private/ca.key.pem 4096
```

### Generate Certificate

```sh
openssl req -config root/openssl.cnf -key root/private/ca.key.pem \
    -new -x509 -days 7300 -sha256 -extensions v3_ca \
    -out root/certs/ca.cert.pem
```

### Generate CRL

```sh
openssl ca -config root/openssl.cnf -gencrl -out root/crl/root.crl.pem
```

## SUB CA

### Folder structure

```
intermediate/
├── certs/
├── crl/
├── newcerts/
├── private/
├── csr/
├── index.txt
├── crlnumber
└── openssl.cnf
```


```sh
touch ./root/crlnumber
echo "01" > ./root/crlnumber
```

```INI
# openssl.cnf

[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ./intermediate
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
crlnumber         = $dir/crlnumber
private_key       = $dir/private/intermediate.key.pem
certificate       = $dir/certs/intermediate.cert.pem
crl               = $dir/crl/intermediate.crl.pem
default_md        = sha256
policy            = policy_loose
default_days      = 3650
unique_subject    = no
email_in_dn       = no
rand_serial       = $dir/private/.rand
default_crl_days  = 30

[ policy_loose ]
countryName            = optional
stateOrProvinceName    = optional
organizationName       = optional
organizationalUnitName = optional
commonName             = supplied
emailAddress           = optional

[ req ]
default_bits        = 4096
default_keyfile     = private/intermediate.key.pem
default_md          = sha256
distinguished_name  = req_distinguished_name
x509_extensions     = v3_ca

[ req_distinguished_name ]
countryName             = Country Name (2 letter code)
stateOrProvinceName     = State or Province Name (full name)
organizationName        = Organization Name (eg, company)
commonName              = Common Name (e.g., server FQDN or YOUR name)

[ v3_intermediate_ca ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints       = critical,CA:true,pathlen:0
keyUsage               = critical, digitalSignature, cRLSign, keyCertSign
crlDistributionPoints  = URI:http://pki.pradeep.dev/intermediate.crl

[ usr_cert ]
basicConstraints       = CA:FALSE
nsCertType             = server
keyUsage               = critical, digitalSignature, keyEncipherment
extendedKeyUsage       = serverAuth
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer

```

### Generate private key

```sh
openssl genrsa -aes256 -out intermediate/private/intermediate.key.pem 4096
```

### Generate CSR
```sh
openssl req -config intermediate/openssl.cnf -new -sha256 \
    -key intermediate/private/intermediate.key.pem \
    -out intermediate/csr/intermediate.csr.pem
```

### Sign sub CA with ROOT CA

```sh
openssl ca -config root/openssl.cnf -extensions v3_intermediate_ca \
    -days 3650 -notext -md sha256 \
    -in intermediate/csr/intermediate.csr.pem \
    -out intermediate/certs/intermediate.cert.pem
```

### Generate CRL

```sh
openssl ca -config intermediate/openssl.cnf -gencrl -out intermediate/crl/intermediate.crl.pem
```

### Revoke a certificate

Certificates that are signed by sub ca can be found under the /newcerts

```sh
openssl ca -config intermediate/openssl.cnf -revoke intermediate/newcerts/<certificate_id>.pem
```

**Note** : Certificate ID to be revoked

#### Example 
```sh
$ ls intermediate/newcerts/
2183BBEED6D0DFB1FDAF7F8D994AC740241291ED.pem
$ openssl ca -config intermediate/openssl.cnf \
    -revoke intermediate/newcerts/2183BBEED6D0DFB1FDAF7F8D994AC740241291ED.pem 
Using configuration from intermediate/openssl.cnf
Enter pass phrase for ./intermediate/private/intermediate.key.pem:
Revoking Certificate 2183BBEED6D0DFB1FDAF7F8D994AC740241291ED.
Data Base Updated
$ 
```

#### Update CRL file

```sh
openssl ca -config intermediate/openssl.cnf -gencrl \
    -out intermediate/crl/intermediate.crl.pem
```

#### Output
```sh
$ openssl crl -in intermediate/crl/intermediate.crl.pem -noout -text
Certificate Revocation List (CRL):
        Version 2 (0x1)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = IN, ST = Karnataka, O = Pradeep Dev, CN = Server Sub CA
        Last Update: Dec 14 16:54:48 2024 GMT
        Next Update: Jan 13 16:54:48 2025 GMT
        CRL extensions:
            X509v3 CRL Number: 
                4097
Revoked Certificates:
    Serial Number: 2183BBEED6D0DFB1FDAF7F8D994AC740241291ED
        Revocation Date: Dec 14 16:50:33 2024 GMT
    Signature Algorithm: sha256WithRSAEncryption
...
```

## End entity / Leaf

### Folder structure
```
leaf/
├── certs/
├── private/
├── csr/
```

```sh
mkdir -p leaf/{private,csr,certs}
```
### Generate private key

```sh
openssl genrsa -out leaf/private/leaf.key.pem 2048
```

### Generate CSR

```bash
openssl req -new -sha256 \
    -key leaf/private/leaf.key.pem \
    -out leaf/csr/leaf.csr.pem
```    

### Sign leaf with sub CA

```sh
openssl ca -config intermediate/openssl.cnf -extensions usr_cert \
    -days 375 -notext -md sha256 \
    -in leaf/csr/leaf.csr.pem \
    -out leaf/certs/leaf.cert.pem
```

