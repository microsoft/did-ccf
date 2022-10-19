import * as crypto from '@microsoft/ccf-app/crypto';

const ID_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH: number = 12;

/**
 * Enumeration defining the
 * {@link KeyPair} states.
 */
export enum KeyState {
    /**
     * Indicates that the key this is the
     * current signing key for the controller.
     */
    current = 'current',

    /**
     * Indicates that the key has been revoked
     * and is not longer used for signing. Any
     * material signed with this is no longer
     * valid.
     */
    revoked = 'revoked',

    /**
     * Indicates that the key has been rolled
     * an the private key is no longer used for signing. 
     * However, any material signed with the key 
     * can still be validated using the public key.
     */
    historical = 'historical',
}

/**
 * Base implementation for holding key pairs.
 */
export class KeyPair implements KeyPair {
    /**
     * The id for the key pair.
     */
     id: string;

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
     * @param {string} publicKey of the key pair.
     * @param {string} privateKey of the key pair.
     */
    constructor (publicKey: string, privateKey: string) {   
        this.id = this.newId(ID_LENGTH);
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.state = KeyState.current;
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
        return new KeyPair(publicKey, privateKey);
    }
}