import { JsonWebKey } from '@microsoft/ccf-app/global';
import { EcdsaCurve } from './EcdsaCurve';
import { EddsaCurve } from './EddsaCurve';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyState } from './KeyState';

const ID_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH: number = 12;

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
        this.id = this.newId(ID_LENGTH);
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

    /**
     * Creates a new random character ID for the keypair.
     * @param {number} length of the ID.
     * @returns {string} of twelve random characters.
     * @description First approach tried using UNIX epoch time 
     * converted to a string as the identifier, but
     * Date() is not supported by a CCF enclave. Nor are UUIDs since
     * these are date derived.
     */
    private newId(length): string {
        const charactersLength = ID_CHARACTERS.length;
        let id = '';

        for (var i = 0; i < length; i++) {
            id += ID_CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
        }

        return id;
    }
}