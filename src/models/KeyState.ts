// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * @enum defining the {@link KeyPair} states.
 */
 export enum KeyState {
    /**
     * Indicates that the key this is the
     * current signing key for the controller.
     */
    Current = 'current',

    /**
     * Indicates that the key has been revoked
     * and is not longer used for signing. Any
     * material signed with this is no longer
     * valid.
     */
    Revoked = 'revoked',

    /**
     * Indicates that the key has been rolled
     * an the private key is no longer used for signing. 
     * However, any material signed with the key 
     * can still be validated using the public key.
     */
    Historical = 'historical',
}
