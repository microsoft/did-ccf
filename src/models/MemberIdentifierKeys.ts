import ControllerDocument from "./ControllerDocument";

const ID_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH: number = 12;

/**
 * Model for representing a members identifier keys
 * in PEM format.
 */
 export default interface MemberIdentifierKeys {

    /**
     * The {@link ControllerDocument} representing the
     * latest state of the identifier.
     */
    controllerDocument: ControllerDocument;

    /**
     * Array of {@link KeyPair} objects.
     */
    keyPairs: KeyPair[];
}

export class KeyPair {
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
     * Constructs a new instance of the {@link KeyPair} class.
     * @param {string} publicKey of the key pair.
     * @param {string} privateKey of the key pair.
     */
    constructor (publicKey: string, privateKey: string) {   
        this.id = this.newId(ID_LENGTH);
        this.publicKey = publicKey;
        this.privateKey = privateKey;
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
}