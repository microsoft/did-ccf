import * as crypto from '@microsoft/ccf-app/crypto';
import { EcdsaCurve } from './EcdsaCurve';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyState } from './KeyState';

const ID_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH: number = 12;

/**
 * Base implementation for holding key pairs.
 */
export class KeyPair implements KeyPair {
    /**
     * The id for the key pair.
     */
    id: string;

    /**
     * The algorithm used for the key.
     */
    algorithm: KeyAlgorithm;

    /**
     * The curve used by the Ecdsa key.
     */
    curve?: EcdsaCurve;

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
    constructor (algorithm: KeyAlgorithm, publicKey: string, privateKey: string) {   
        this.id = this.newId(ID_LENGTH);
        this.algorithm = algorithm;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.state = KeyState.Current;
    }

    /**
     * Creates a new random character ID for the keypair.
     * @param {number} length of the ID.
     * @returns {string} of twelve random characters.
     * @description First approach tried using UNIX epoch time 
     * converted to a string as the identifier, but
     * Date() is not supported by a CCF enclave. Nor are UUIDs.
     */
    private newId(length): string {
        const charactersLength = ID_CHARACTERS.length;
        let id = '';

        for ( var i = 0; i < length; i++ ) {
            id += ID_CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        return id;
    }

    /**
     * Returns a new instance of an RSA key pair.
     * @param {number} {size} of the key pair to generate. Default is 4096.
     * @returns A new RSA key pair.
     */
    static newRsaKeyPair(size: number = 4096) : KeyPair {
        const { publicKey, privateKey } = crypto.generateRsaKeyPair(size);
        return new KeyPair(KeyAlgorithm.Rsa, publicKey, privateKey);
    }

    /**
     * Returns a new instance of an ECDSA key pair.
     * @param {EcdsaCurve} curve of the key pair to generate. Default is {@link EcdsaCurve.Secp256r1}.
     * @returns A new ECDSA key pair.
     */
    static newEcdsaKeyPair(curve: EcdsaCurve = EcdsaCurve.Secp256r1) : KeyPair {
        const { publicKey, privateKey } = crypto.generateEcdsaKeyPair(curve.toString());
        const keyPair = new KeyPair(KeyAlgorithm.Ecdsa, publicKey, privateKey);
        keyPair.curve = curve;
        return keyPair;
    }
}