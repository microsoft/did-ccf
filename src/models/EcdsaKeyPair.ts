import * as crypto from '@microsoft/ccf-app/crypto';
import { JsonWebKey } from '@microsoft/ccf-app/global';
import { EcdsaCurve } from '../models/EcdsaCurve'; 
import { KeyAlgorithm } from '../models/KeyAlgorithm';
import { KeyPair } from '../models/KeyPair';
import { KeyUse } from './KeyUse';

/**
 * Implementation of an ECDSA key pair.
 */
export class EcdsaKeyPair extends KeyPair {

    /**
     * Constructs a new instance of the {@link EcdsaKeyPair} class.
     * @param {KeyUse} [use=KeyUse.Signing] indicating what the key can be used for.
     */
    constructor(curve: EcdsaCurve = EcdsaCurve.Secp256r1, use: KeyUse = KeyUse.Signing) {
        const { publicKey, privateKey } = crypto.generateEcdsaKeyPair(curve);
        super(KeyAlgorithm.Ecdsa, publicKey, privateKey, use);
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
