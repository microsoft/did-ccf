// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * @enum of key algorithms.
 */
 export enum KeyAlgorithm {
    /**
     * RSA Algorithm.
     */
    Rsa = 'RSASSA-PKCS1-v1_5',

    /**
     * ECDSA Algorithm.
     */
    Ecdsa = 'ECDSA',

    /**
     * EDDSA Algorithm.
     */
    Eddsa = 'EdDSA',
}
