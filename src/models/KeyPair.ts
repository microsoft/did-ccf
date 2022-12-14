import { JsonWebKey } from '@microsoft/ccf-app/global';
import { EcdsaCurve } from './EcdsaCurve';
import { EddsaCurve } from './EddsaCurve';
import { Identifier } from './Identifier';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyState } from './KeyState';

/**
 * Base implementation for holding key pairs.
 */
export abstract class KeyPair implements KeyPair {
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
     */
    constructor(algorithm: KeyAlgorithm, publicKey: string, privateKey: string) {
        this.id = `#${Identifier.generate()}`;
        this.algorithm = algorithm;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.state = KeyState.Current;
    }

    /**
     * Returns the instance as a {@link JsonWebKey}.
     * @param {boolean} privateKey indicating whether the JWK should
     * include the private key.
     */
    abstract asJwk(privateKey: boolean): JsonWebKey;
}