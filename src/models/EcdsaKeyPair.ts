import * as crypto from '@microsoft/ccf-app/crypto';
import { JsonWebKey } from '@microsoft/ccf-app/global';
import { EcdsaCurve } from './EcdsaCurve';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyPair } from './KeyPair';

/**
 * Implementation of an ECDSA key pair.
 */
export class EcdsaKeyPair extends KeyPair {

    /**
     * Constructs a new instance of the {@link EcdsaKeyPair} class.
     */
    constructor(curve: EcdsaCurve = EcdsaCurve.Secp256r1) {
        const { publicKey, privateKey } = crypto.generateEcdsaKeyPair(curve);
        super(KeyAlgorithm.Ecdsa, publicKey, privateKey);
        this.curve = curve;
    }

    /**
     * Returns the instance as a {@link JsonWebKey}.
     * @param {boolean} privateKey indicating whether the JWK should
     * include the private key. Default is false.
     */
    public asJwk(privateKey: boolean = false): JsonWebKey {
        return privateKey ?
            crypto.pemToJwk(this.privateKey, this.id) :
            crypto.pubPemToJwk(this.publicKey, this.id);
    }
}
