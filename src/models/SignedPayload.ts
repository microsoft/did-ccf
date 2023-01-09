// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import * as crypto from '@microsoft/ccf-app/crypto';

/**
 * An interface defining the structure of a signed payload.
 */
export interface SignedPayload {
    /**
     * The signature over the request payload.
     */
  signature: string;

    /**
     * The signed payload.
     */
  payload: string;

    /**
     * The controller identifier that signed the payload.
     */
  signer?: string;

    /**
     * The key algorithm used for the signature. If not provided the
     * algorithm associated with key in the members key list is used.
     */
  algorithm?: crypto.SigningAlgorithm;

    /**
     * The identifier of the key used to sign. If no key identifier is specified
     * the default current signing key is used.
     */
  keyIdentifier?: string;
}
