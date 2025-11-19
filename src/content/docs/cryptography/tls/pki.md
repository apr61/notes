---
title: Create your own PKI
date: 07/03/2025
---

Creating your own PKI these commands can be used.

**Library** - Openssl

**Encryption Algorithm** - RSA


## ROOT CA

### Folder structure

Create directory

```sh
mkdir -p root/{certs,crl,newcerts,private}
```

Create required files

```sh
touch root/{index.txt,crlnumber,openssl.cnf}
echo "01" > crlnumber
```

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

```
// openssl.cnf

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

[ v3_intermediate_ca ]
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
extendedKeyUsage = serverAuth, clientAuth
authorityKeyIdentifier = keyid:always, issuer
subjectKeyIdentifier = hash
crlDistributionPoints  = URI:http://pki.pradeep.dev/root_ca.crl

```

### Generate private key

```sh
openssl genrsa -out root/private/ca.key.pem 4096
```

### Generate Certificate
```sh
openssl req -config root/openssl.cnf -key root/private/ca.key.pem -new -x509 -sha256 -out root/certs/ca.cert.pem
```

### Generate CRL

```sh
openssl ca -config root/openssl.cnf -gencrl -out root/crl/root.crl.pem
```

---
---

## Server Sub CA

Create directory

```sh
mkdir -p server_sub_ca/{certs,crl,newcerts,private,csr}
```

Create required files

```sh
touch server_sub_ca/{index.txt,crlnumber,openssl.cnf}
echo "01" > crlnumber
```

### Folder structure

```
server_sub_ca/
├── certs/
├── crl/
├── newcerts/
├── private/
├── csr/
├── index.txt
├── crlnumber
└── openssl.cnf
```

```cnf
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ./server_sub_ca
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
crlnumber         = $dir/crlnumber
private_key       = $dir/private/server_sub_ca.key.pem
certificate       = $dir/certs/server_sub_ca.cert.pem
crl               = $dir/crl/server_sub_ca.crl.pem
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
default_keyfile     = private/server_sub_ca.key.pem
default_md          = sha256
distinguished_name  = req_distinguished_name
x509_extensions     = v3_intermediate_ca

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

[ usr_cert ]
basicConstraints       = CA:FALSE
nsCertType             = server
keyUsage               = critical, digitalSignature, keyEncipherment
extendedKeyUsage       = serverAuth
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer
crlDistributionPoints  = URI:http://pki.pradeep.dev/server_sub_ca.crl

```

### Generate private key

```sh
openssl genrsa -out server_sub_ca/private/server_sub_ca.key.pem 4096
```

### Generate CSR
```sh
openssl req -config server_sub_ca/openssl.cnf -new -sha256 \
    -key server_sub_ca/private/server_sub_ca.key.pem \
    -out server_sub_ca/csr/server_sub_ca.csr.pem
```

### Sign sub CA with ROOT CA

```sh
openssl ca -config root/openssl.cnf -extensions v3_intermediate_ca \
    -notext -md sha256 \
    -in server_sub_ca/csr/server_sub_ca.csr.pem \
    -out server_sub_ca/certs/server_sub_ca.cert.pem
```

### Revoke a certificate

Certificates that are signed by sub ca can be found under the /newcerts

```sh
openssl ca -config server_sub_ca/openssl.cnf -revoke server_sub_ca/newcerts/<certificate_id>.pem
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
openssl ca -config server_sub_ca/openssl.cnf -gencrl \
    -out server_sub_ca/crl/server_sub_ca.crl.pem
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

---
---

## Client Sub CA

Create directory

```sh
mkdir -p client_sub_ca/{certs,crl,newcerts,private,csr}
```

Create required files

```sh
touch client_sub_ca/{index.txt,crlnumber,openssl.cnf}
echo "01" > crlnumber
```

### Folder structure

```
client_sub_ca/
├── certs/
├── crl/
├── newcerts/
├── private/
├── csr/
├── index.txt
├── crlnumber
└── openssl.cnf
```

```cnf
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ./client_sub_ca
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
crlnumber         = $dir/crlnumber
private_key       = $dir/private/client_sub_ca.key.pem
certificate       = $dir/certs/client_sub_ca.cert.pem
crl               = $dir/crl/client_sub_ca.crl.pem
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
default_keyfile     = private/client_sub_ca.key.pem
default_md          = sha256
distinguished_name  = req_distinguished_name
x509_extensions     = v3_intermediate_ca

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

[ usr_cert ]
basicConstraints       = CA:FALSE
nsCertType             = server
keyUsage               = critical, digitalSignature, keyEncipherment
extendedKeyUsage       = clientAuth
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer
crlDistributionPoints  = URI:http://pki.pradeep.dev/client_sub_ca.crl

```

### Generate private key

```sh
openssl genrsa -out client_sub_ca/private/client_sub_ca.key.pem 4096
```

### Generate CSR
```sh
openssl req -config client_sub_ca/openssl.cnf -new -sha256 \
    -key client_sub_ca/private/client_sub_ca.key.pem \
    -out client_sub_ca/csr/client_sub_ca.csr.pem
```

### Sign sub CA with ROOT CA

```sh
openssl ca -config root/openssl.cnf -extensions v3_intermediate_ca \
    -notext -md sha256 \
    -in client_sub_ca/csr/client_sub_ca.csr.pem \
    -out client_sub_ca/certs/client_sub_ca.cert.pem
```


### Revoke a certificate

Certificates that are signed by sub ca can be found under the /newcerts

```sh
openssl ca -config client_sub_ca/openssl.cnf -revoke client_sub_ca/newcerts/<certificate_id>.pem
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
openssl ca -config client_sub_ca/openssl.cnf -gencrl \
    -out client_sub_ca/crl/client_sub_ca.crl.pem
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

---
---

## Server certificate

Create directory

```sh
mkdir -p cert_server/{private,csr,certs}
```

### Folder structure

```
cert_server/
├── certs/
├── private/
├── csr/
```

### Generate private key

```sh
openssl genrsa -out cert_server/private/cert_server.key.pem 2048
```

### Generate CSR

```sh
openssl req -new -sha256 \
    -key cert_server/private/cert_server.key.pem \
    -out cert_server/csr/cert_server.csr.pem
```    

### Sign cert_server with server sub CA

```sh
openssl ca -config server_sub_ca/openssl.cnf -extensions usr_cert -notext \
    -md sha256 -in cert_server/csr/cert_server.csr.pem \
    -out cert_server/certs/cert_server.cert.pem
```

---
---


## Client certificate

Create directory

```sh
mkdir -p cert_client/{private,csr,certs}
```

### Folder structure

```
cert_client/
├── certs/
├── private/
├── csr/
```

### Generate private key

```sh
openssl genrsa -out cert_client/private/cert_client.key.pem 2048
```

### Generate CSR

```sh
openssl req -new -sha256 \
    -key cert_client/private/cert_client.key.pem \
    -out cert_client/csr/cert_client.csr.pem
```    

### Sign cert_client with client sub CA

```sh
openssl ca -config client_sub_ca/openssl.cnf -extensions usr_cert -notext \
    -md sha256 -in cert_client/csr/cert_client.csr.pem \
    -out cert_client/certs/cert_client.cert.pem
```

---
---


```sh
openssl s_server -accept 10443 -cert server_cert.pem -key server_key.pem -CApath ./ca_crl_path -crl_check -msg -Verify 2 -verify_return_error

cd /etc/apache2/ssl/pradeep-dev

openssl s_server -accept 10443 -cert server_cert.pem -key server_key.pem -CApath ./ca_crl_path -crl_check -msg -Verify 2 -verify_return_error

openssl s_client -connect localhost:10443 -cert ~/Learning/Cpp/proxy/files/client_certs/LEAF_CERT.pem -key ~/Learning/Cpp/proxy/files/client_certs/LEAF_PKEY.pem -CApath ./ca_crl_path/ -msg
```