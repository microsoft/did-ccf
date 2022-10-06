# did:ccf Method Specification

**Authors**: Brandon Murdoch, Eddy Ashton, Amaury Chamayou, Sylvan Clebsch  
**Latest version**: https://github.com/microsoft/did-ccf/blob/main/did-ccf.md  
**Status**: Draft  

## Introduction

The Confidential Consortium Framework (CCF) is an open-source framework for building a new category of secure, highly-available, and performant applications that focus on multi-party compute and data.
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
did:ccf:exp-did-ccf.confidential-ledger.azure.com:EiClkZMDxPKqC9c
```