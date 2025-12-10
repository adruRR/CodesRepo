#!/bin/bash

mkdir -p cert

cat > cert/openssl.cnf <<EOF
[req]
distinguished_name = req_distinguished_name
prompt = no

[req_distinguished_name]
C=BO
ST=State
L=City
O=company
OU=Com
CN=localhost
EOF

openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout cert/key.pem \
  -out cert/cert.pem \
  -days 365 \
  -config cert/openssl.cnf
