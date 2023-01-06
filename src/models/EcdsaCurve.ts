// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * Enumeration of ECDSA curves.
 */
export enum EcdsaCurve {
    /**
     * 256 bit using random curve.
     */
    Secp256r1 = 'secp256r1',

    /**
     * 256 bit using Koblitz curve.
     */
    Secp256k1 = 'secp256k1',

    /**
     * 384 bit using random curve.
     */
    Secp384r1 = 'secp384r1',
}
