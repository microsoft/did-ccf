import * as crypto from '@microsoft/ccf-app/crypto';
import { JsonWebKey } from '@microsoft/ccf-app/global';
import { EddsaCurve } from './EddsaCurve';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyPair } from './KeyPair';

/**
 * Implementation of an EDDSA key pair.
 */
export class EddsaKeyPair extends KeyPair {

    /**
     * Constructs a new instance of the {@link EddsaKeyPair} class.
     */
    constructor() {
        const { publicKey, privateKey } = crypto.generateEddsaKeyPair(EddsaCurve.Curve25519);
        super(KeyAlgorithm.Eddsa, publicKey, privateKey);
        this.curve = EddsaCurve.Curve25519;
    }

    /**
     * Returns the instance as a {@link JsonWebKey}.
     * @param {boolean} privateKey indicating whether the JWK should
     * include the private key. Default is false.
     */
    public asJwk(privateKey: boolean = false): JsonWebKey {
        return privateKey ? 
            crypto.eddsaPemToJwk(this.privateKey, this.id) : 
            crypto.pubEddsaPemToJwk(this.publicKey, this.id);
    }
}
