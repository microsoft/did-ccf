import { VerificationMethodType } from './VerificationMethodType';

/**
 * Model for representing a {@link https://www.w3.org/TR/did-core/} verification
 * method.
 */
export interface VerificationMethod {
    /**
     * The id for the verification method
     */
    id: string;

    /**
     * The controller of the verification method. Defaults
     * to the {@link DidDocument.id } if not specified.
     */
    controller?: string;

    /**
     * The {@link VerificationMethodType}.
     */
    type: VerificationMethodType;

    /**
     * The public key in Json Web Key (JWK) format.
     */
    publicKeyJwk: any;
}
