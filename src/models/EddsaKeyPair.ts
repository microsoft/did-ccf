import * as crypto from '@microsoft/ccf-app/crypto';
import { JsonWebKey } from '@microsoft/ccf-app/global';
import { EddsaCurve } from '../models/EddsaCurve'; 
import { KeyAlgorithm } from '../models/KeyAlgorithm';
import { KeyPair } from '../models/KeyPair';
import { KeyUse } from '../models/KeyUse';

/**
 * Implementation of an EDDSA key pair.
 */
export class EddsaKeyPair extends KeyPair {

    /**
     * Constructs a new instance of the {@link EddsaKeyPair} class.
     * @param {KeyUse} [use=KeyUse.Signing] indicating what the key can be used for.
     */
    constructor(use: KeyUse = KeyUse.Signing) {
        const { publicKey, privateKey } = crypto.generateEddsaKeyPair(EddsaCurve.Curve25519);
        super(KeyAlgorithm.Eddsa, publicKey, privateKey, use);
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
