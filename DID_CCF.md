# did:ccf Method Specification

**Authors**: Brandon Murdoch, Eddy Ashton, Amaury Chamayou, Sylvan Clebsch, Stephen Higgins, Adam Duff  
**Latest version**: https://github.com/microsoft/did-ccf/blob/main/did-ccf.md  
**Status**: Working Draft  

## Introduction

The Confidential Consortium Framework (CCF) is an open-source framework for building a new category of secure, highly available, and performant applications that focus on multi-party compute and data.
Leveraging the power of trusted execution environments (TEE, or enclave), decentralised systems concepts, and cryptography, CCF enables enterprise-ready multiparty systems.

This specification defines how decentralized identifiers can be generated and registered on a CCF Network.

### Syntax and Interpretation

```
did-ccf:           "did:ccf:" + account_id 
account_id:        domain|node_id + ":" + account_address
domain:            [-a-zA-Z0-9\-\.]{1,253}
node_id:           [-a-zA-Z0-9\-\.]{1,64}
account_address:   [a-zA-Z0-9\_\-]{1,64}
```
### Examples
#### Scoped to a node identifier (default configuration)
```
did:ccf:entra.confidential-ledger.azure.com:EiClkZMDxPKqC9c
```
#### Scoped to a (registered) domain
```
did:ccf:example.com:Y0EI0lIbEm8nBvaWnogpg
```

## Domains
`did:ccf` identifiers can be scoped to _domains_, strings that identify a realm of administrative authority. A single CCF Network can handle decentralized identifiers for multiple domains.

### Registration
Members of a consortium can register a domain in which decentralized identifiers can be created by adding a row, keyed by the domain name, to the `public:ccf.gov.did.domains` [public governance table](https://microsoft.github.io/CCF/main/audit/read_write_restrictions.html#table-namespaces), which can be accomplished via an Action in the Constitution.

#### Action
```javascript
[
  "add_did_domain",
  new Action(
    function (args) {
      checkType(args.name, "string");
    },
    function (args) {
      const name = ccf.strToBuf(args.name);
      const table = "public:ccf.gov.did.domains";

      // If the domain is already there, do nothing
      if (ccf.kv[table].get(name) === undefined) {
        const domain = {name};
        ccf.kv[table].set(name, ccf.jsonCompatibleToBuf(domain));
      }
    }
  ),
]
```
To invoke this action, typically one member will propose the invocation and - depending on the terms of the Constitution - and others will vote to accept.

#### Proposal
```sh
ccf_cose_sign1 --ccf-gov-msg-type proposal --ccf-gov-msg-created_at `date -Is` --signing-key <member_private_key.pem> --signing-cert <member_certificate.pem> --content add_member.json | \
curl https://<ccf-node-address>/gov/proposals --cacert service_cert.pem --data-binary @- -H "content-type: application/cose"
```
##### add_did_domain.json
```json
{
  "actions": [
    {
      "name": "add_did_domain",
      "args": {
        "name": "example.com"
      }
    }
  ]
}
```
Any such domain should indicate one or more nodes in the Network, such that DIDs in that domain may be resolved; `did:ccf` domains are interoperable with the Domain Name System, but not restricted to it.

### De-registration
Members of a consortium can de-register a previously-registered domain by removing the row keyed by the domain's name from the `public:ccf.gov.did.domains` [public governance table](https://microsoft.github.io/CCF/main/audit/read_write_restrictions.html#table-namespaces).
#### Action
```javascript
[
  "remove_did_domain",
  new Action(
    function (args) {
      checkType(args.name, "string");
    },
    function (args) {
      const name = ccf.strToBuf(args.name);
      const table = "public:ccf.gov.did.domains";
      if (ccf.kv[table].has(name)) {
        ccf.kv[table].delete(name);
      }
    }
  ),
]
```
#### Proposal
```sh
ccf_cose_sign1 --ccf-gov-msg-type proposal --ccf-gov-msg-created_at `date -Is` --signing-key <member_private_key.pem> --signing-cert <member_certificate.pem> --content remove_did_domain.json | \
curl https://<ccf-node-address>/gov/proposals --cacert service_cert.pem --data-binary @- -H "content-type: application/cose"
```
##### remove_did_domain.json
```json
{
  "actions": [
    {
      "name": "remove_did_domain",
      "args": {
        "name": "example.com"
      }
    }
  ]
}
```
De-registering a domain does _not_ invalidate DIDs previously created in the domain, but does prevent new DIDs from being created in the domain.

## DID Operations

### Create (Private API)
All authenticated members of a consortium and registered users of a given CCF network can create new decentralized identifiers by calling the **identifiers/create** endpoint. This API generates a cryptographic key pair and DID Document which is stored in the members confidential computing enclave.

The endpoints would be used as follows where the data-binary is the buffer/byte array of the signed cose of an empty payload. Alternativly JWTs could be used, for examples see [JWT Authentication CCF Documentation](https://microsoft.github.io/CCF/main/build_apps/auth/jwt.html).
```sh
curl https://<host>/app/identifiers/create --cacert <service_certificate>.pem --data-binary @- -H "content-type: application/cose" -X POST

curl https://<host>/app/identifiers/create?alg=ECDSA'&'curve=secp256k1 --cacert <service_certificate>.pem ---data-binary @- -H "content-type: application/cose" -X POST
```

Supported key algorithms (alg):
- RSASSA_PKCS1-v1_5
- ECDSA
- EdDSA
    
Supported ECDSA curves (curve):
- secp256k1
- secp256r1
- secp384r1

#### Domain
A caller seeking to create a DID in a given domain can specify the domain's name via the `domain` query string parameter. If the given domain has not previously been registered in the CCF Network by an authenticated member, then the request to create a DID in the domain will be rejected.

If a caller does _not_ specify a domain in which to create a DID, then the DID will be created under the domain corresponding to the hostname of the node in the Network to which the caller submits the request.

### Resolve (Public API)
DIDs can be resolved via the public endpoint **/identifiers/\<did\>/resolve** which returns the DID Document associated with the identifier if found on the network.

```
https://<host>/app/identifiers/<did>/resolve
```
```json
{
    "id": "did:ccf:example.com:6eJ3sNIa83RmotH2qy2AH3FBsBvcAAtwpCwkHRwu1hg",
    "verificationMethod": [
        {
            "id": "#z2zHnxFN2QCK",
            "controller": "did:ccf:example.com:6eJ3sNIa83RmotH2qy2AH3FBsBvcAAtwpCwkHRwu1hg",
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
           "@vocab": "https://github.com/microsoft/did-ccf/blob/main/DID_CCF.md#"
        }
    ],
    "authentication": [
        "z2zHnxFN2QCK"
    ]
}
```
### Update (Private API)
All authenticated members of a consortium and registered users of a given CCF Network can update (roll, revoke) the keys associated with an identifier they own by calling the **identifiers/\<did\>/keys/roll** and **identifiers/\<did\>/keys/revoke** endpoints. 

When rolling the current signing key for a given identifier, if no algorithm or curve parameters are specified, the existing key properties are used to determine the new key. Key rolling results in the deletion of the private key and the key entry being marked as historical. Historical keys continue to be listed in the DID Document for the identifier. If a caller wants to invalidate all credentials signed by a particular key, then the key should be revoked. This deletes the private key and marks the key as revoked, removing the key from the list of signing keys in the DID Document.

Supported key algorithms (alg):
- RSASSA_PKCS1-v1_5
- ECDSA
- EdDSA
    
Supported ECDSA curves (curve):
- secp256k1
- secp256r1
- secp384r1

```
./scurl.sh https://<host>/app/identifiers/<did>/keys/roll --cacert <service_certificate>.pem ---data-binary @- -H "content-type: application/cose" -X PATCH

./scurl.sh https://<host>/app/identifiers/<did>/keys/<kid>/revoke --cacert <service_certificate>.pem ---data-binary @- -H "content-type: application/cose" -X POST
```

### Deactivate
All authenticated members of a consortium and registered users of a given CCF Network can deactivate an identifier that is under their control by calling the **identifiers/\<did\>/deactivate** endpoint. This API checks that the caller making the request is the owner of the identifier and if true, removes the identifier and all it's associated keys from the network.

```
./scurl.sh https://<host>/app/identifiers/<did>/deactivate --cacert <service_certificate>.pem ---data-binary @- -H "content-type: application/cose" -X PATCH
```

## Security and Privacy Considerations
Confidential Consortium Framework (CCF) is an open-source framework for building highly available stateful services that leverage centralized compute for ease of use and performance, while providing decentralized trust. It enables multiple parties to execute auditable compute over confidential data without trusting each other or a privileged operator.

- Governance: Transparent, programmable consortium-style proposal and voting based governance that supports enterprise operating models
- Service Integrity: Hardware-backed integrity for application logic and data
- Confidentiality & Privacy: All transactions are confidential by default
- Performance: Database-like throughput, low latency, deterministic commits
- Efficiency: Minimal execution overhead compared to traditional solutions
- Resiliency: High availability and secure disaster recovery