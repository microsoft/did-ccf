# did:ccf Method Specification

**Authors**: Brandon Murdoch, Eddy Ashton, Amaury Chamayou, Sylvan Clebsch  
**Latest version**: https://github.com/microsoft/did-ccf/blob/main/did-ccf.md  
**Status**: Working Draft  

## Introduction

The Confidential Consortium Framework (CCF) is an open-source framework for building a new category of secure, highly available, and performant applications that focus on multi-party compute and data.
Leveraging the power of trusted execution environments (TEE, or enclave), decentralised systems concepts, and cryptography, CCF enables enterprise-ready multiparty systems.

This specification defines how decentralized identifiers can be generated and registered on a CCF Network.

### Syntax and Interpretation

```
did-ccf:           "did:ccf:" + account_id 
account_id:        node_id + ":" + account_address
node_id:           [-a-zA-Z0-9\-\.]{1,64}
account_address:   [a-zA-Z0-9]{1,64}
```
### Example
```
did:ccf:entra.confidential-ledger.azure.com:EiClkZMDxPKqC9c
```

## DID Operations

### Create (Private API)
All authenticated members of the consortium can create new decentralized identifiers by calling the **identifiers/create** endpoint. This API generates a cryptographic key pair and DID Document which is stored in the members confidential computing enclave. 

```
./scurl.sh https://<host>/app/identifiers/create --cacert <service_certificate>.pem --signing-key <member_private_key.pem> --signing-cert <member_certificate.pem> -H "content-type: application/json" -X POST

./scurl.sh https://<host>/app/identifiers/create?alg=ECDSA'&'curve=secp256k1 --cacert <service_certificate>.pem --signing-key <member_private_key.pem> --signing-cert <member_certificate.pem> -H "content-type: application/json" -X
```

Supported key algorithms (alg):
- RSASSA_PKCS1-v1_5
- ECDSA
- EdDSA
    
Supported ECDSA curves (curve):
- secp256k1
- secp256r1
- secp384r1

### Resolve (Public API)
DIDs can be resolved via the public endpoint **/identifiers/<did>/resolve** which returns the DID Document associated with the identifier if found on the network.

```
https://<host>.com/app/identifiers/<did>/resolve
```
```json
{
    "id": "did:ccf:entra.confidential-ledger.azure.com:6eJ3sNIa83RmotH2qy2AH3FBsBvcAAtwpCwkHRwu1hg",
    "verificationMethods": [
        {
            "id": "z2zHnxFN2QCK",
            "controller": "did:ccf:entra.confidential-ledger.azure.com:6eJ3sNIa83RmotH2qy2AH3FBsBvcAAtwpCwkHRwu1hg",
            "type": "JsonWebKey2020",
            "publicKeyJwk": {
                "e": "AQAB",
                "kid": "z2zHnxFN2QCK",
                "kty": "RSA",
                "n": "zQdgiiuPWPtuIMwU8ehILTr861hRXhcfE830oz559j9aqY-d2AY0F1iCsMAjqQTGifY2yjnYxDlItaKzhQ6xM6uwwv16DQjiv4l1-7QtU-ltgDCAMQR4FOA3rZ8_sl8T-V3BQqMY431AiCgV0ZrxjCSP01EHRnybDSmHbXPvJJEYSdXmMSDUhWrOQC3RPXSrLGxUXmu9bI-Nt3qY6RIHh3d2PYvnVasR5pUNzQVBrqCKQkeydvPeUV_wVMYKcGjH8Dr_99UCPlGItvfD-CcvSOBzYT7QeWXosAgrcxXr1fKvDVocnwBBliwaYraJjuX0ccOT8OTW4MlegFboSQViwVPn6sB5jn-vlwtaSUgj4NZzZ5rB2GLxB1yTDkJ3YNsNGV70oRZ5_aANLf3zpoqSYy1_xBW0TZhXfUgn3296f3fDr6PhH4B3tgjNvy1Ym0n4MCpu5KI3YB5a_88ljigzm5zBjji53zujzGi87gMYY0tzvSf0MQH93qoP7ch62crQjbJ-0gHYc8ib3IP_ixqFM7-PDD4r_q2-GSAbcKkoue4zGjQPGok8yZHTDETKlkmnEr6zSS9AiUmKpxZS4KBWTafFUwEIMpmt5n0eHpU6TW113SRhS2Q_6EzKlQ0ZqJCDtkmQigDYUTeg4Q1zvC4ym4AG_YttIpYZqqJ_QBI5S6s"
            }
        }
    ],
    "@context": [
        "https://www.w3.org/ns/did/v1",
        {
            "@base": "did:ccf:entra.confidential-ledger.azure.com:6eJ3sNIa83RmotH2qy2AH3FBsBvcAAtwpCwkHRwu1hg"
        }
    ],
    "authentication": [
        "z2zHnxFN2QCK"
    ]
}
```
### Update (Private API)
All authenticated members of the consortium can update (roll, revoke) the keys associated with an identifier they own by calling the **identifiers/keys/roll** and **identifiers/keys/revoke** endpoints. 

When rolling the current signing key for a given identifier, if no algorithm or curve parameters are specified, the existing key properties are used to determine the new key. Key rolling results in the deletion of the private key and the key entry being marked as historical. Historical keys continue to be listed in the DID Document for the identifier. If a member wants to invalidate all credentials signed by a particular key, then the key should be revoked. This deletes the private key and marks the key as revoked, removing the key from the list of signing keys in the DID Document.

Supported key algorithms (alg):
- RSASSA_PKCS1-v1_5
- ECDSA
- EdDSA
    
Supported ECDSA curves (curve):
- secp256k1
- secp256r1
- secp384r1

```
./scurl.sh https://<host>/app/identifiers/<did>/keys/roll --cacert <service_certificate>.pem --signing-key <member_private_key.pem> --signing-cert <member_certificate.pem> -H "content-type: application/json" -X PATCH

./scurl.sh https://<host>/app/identifiers/<did>/keys/<kid>/revoke --cacert <service_certificate>.pem --signing-key <member_private_key.pem> --signing-cert <member_certificate.pem> -H "content-type: application/json" -X POST
```

### Deactivate
All authenticated members of the consortium can deactivate an identifier that is under their control by calling the **identifiers/<did>/decativate** endpoint. This API checks that the member making the request is the owner of the identifier and if true, removes the identifier and all it's associated keys from the network.

```
./scurl.sh https://<host>/app/identifiers/<did>/deactivate --cacert <service_certificate>.pem --signing-key <member_private_key.pem> --signing-cert <member_certificate.pem> -H "content-type: application/json" -X PATCH
```

## Security and Privacy Considerations
Confidential Consortium Framework (CCF) is an open-source framework for building highly available stateful services that leverage centralized compute for ease of use and performance, while providing decentralized trust. It enables multiple parties to execute auditable compute over confidential data without trusting each other or a privileged operator.

- Governance: Transparent, programmable consortium-style proposal and voting based governance that supports enterprise operating models
- Service Integrity: Hardware-backed integrity for application logic and data
- Confidentiality & Privacy: All transactions are confidential by default
- Performance: Database-like throughput, low latency, deterministic commits
- Efficiency: Minimal execution overhead compared to traditional solutions
- Resiliency: High availability and secure disaster recovery