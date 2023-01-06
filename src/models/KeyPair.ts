// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { JsonWebKey } from '@microsoft/ccf-app/global';
import { EcdsaCurve } from './EcdsaCurve';
import { EddsaCurve } from './EddsaCurve';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyState } from './KeyState';
import { KeyUse } from './KeyUse';

const ID_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH: number = 12;

/**
 * Abstract @class for defining a model for key pairs.
 */
export abstract class KeyPair {
    /**
     * The id for the key pair.
     */
    id: string;

    /**
     * The algorithm used for the key.
     */
    algorithm: KeyAlgorithm;

    /**
     * The size of the key if {@link KeyAlgorithm.Rsa}.
     */
    size?: number;

    /**
     * Indicates what the key can be used for, either
     * {@link KeyUse.Encryption} or {@link KeyUse.Signing}.
     */
    use: KeyUse;

    /**
     * The curve used by the key if the key is a
     * {@link KeyAlgorithm.Ecdsa} or {@link KeyAlgorithm.Eddsa} key.
     */
    curve?: EcdsaCurve | EddsaCurve;

    /**
     * Members public key.
     */
    publicKey: string;

    /**
     * [Optional] Members private key.
     */
    privateKey?: string;

    /**
     * The {@link KeyState} of the key pair.
     */
    state: KeyState;

    /**
     * Constructs a new instance of the {@link KeyPair} class.
     * @param {KeyAlgorithm} algorithm of the key pair. 
     * @param {string} publicKey of the key pair.
     * @param {string} privateKey of the key pair.
     * @param {KeyUse} [use=KeyUse.Signing] indicating what the key can be used for.
     */
    constructor(algorithm: KeyAlgorithm, publicKey: string, privateKey: string, use: KeyUse = KeyUse.Signing) {
        this.id = `#${KeyPair.generateId()}`;
        this.use = use;
        this.algorithm = algorithm;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.state = KeyState.Current;
    }

    /**
     * Creates a new random character ID for the key pair.
     * @param {number} [length] of the ID. Default is 12.
     * @returns {string} of random characters of the specified length.
     * @description First approach tried using UNIX epoch time 
     * converted to a string as the identifier, but
     * Date() is not supported by a CCF enclave. Nor are UUIDs since
     * these are date derived.
     */
    public static generateId(length = ID_LENGTH): string {
        const charactersLength = ID_CHARACTERS.length;
        let id = '';

        for (var i = 0; i < length; i++) {
            id += ID_CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
        }

        return id;
    }

    /**
     * Returns the instance as a {@link JsonWebKey}.
     * @param {boolean} privateKey indicating whether the JWK should
     * include the private key.
     */
    abstract asJwk(privateKey: boolean): JsonWebKey;
}