import * as crypto from '@microsoft/ccf-app/crypto';
import { JsonWebKey } from '@microsoft/ccf-app/global';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyPair } from './KeyPair';
import { KeyUse } from './KeyUse';

/**
 * Implementation of an RSA key pair.
 */
export class RsaKeyPair extends KeyPair {

    /**
     * Constructs a new instance of the {@link RsaKeyPair} class.
     * @param {number} size of the key. Default is 4096.
     * @param {KeyUse} [use=KeyUse.Signing] indicating what the key can be used for.
     */
    constructor(size: number = 4096, use: KeyUse = KeyUse.Signing) {
        const { publicKey, privateKey } = crypto.generateRsaKeyPair(size);
        super(KeyAlgorithm.Rsa, publicKey, privateKey, use);
    }

    /**
     * Returns the instance as a {@link JsonWebKey}.
     * @param {boolean} privateKey indicating whether the JWK should
     * include the private key. Default is false.
     */
    public asJwk(privateKey: boolean = false): JsonWebKey {
        return privateKey ? 
            crypto.rsaPemToJwk(this.privateKey, this.id) : 
            crypto.pubRsaPemToJwk(this.publicKey, this.id);
    }
}