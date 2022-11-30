const ID_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH: number = 12;

/**
 * Generates an identifier that can be used for uniquely identifying resources.
 */
export class Identifier {
    /**
     * Creates a new random character ID for the identifier.
     * @param {number} [length] of the ID. Default is 12.
     * @returns {string} of random characters of the specified length.
     * @description First approach tried using UNIX epoch time 
     * converted to a string as the identifier, but
     * Date() is not supported by a CCF enclave. Nor are UUIDs since
     * these are date derived.
     */
    public static generate(length = ID_LENGTH): string {
        const charactersLength = ID_CHARACTERS.length;
        let id = '';

        for (var i = 0; i < length; i++) {
            id += ID_CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
        }

        return id;
    }
}