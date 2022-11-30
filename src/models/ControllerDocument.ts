import { VerificationMethodRelationship } from './VerificationMethodRelationship';
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

/**
 * Model for representing a {@link https://www.w3.org/TR/did-core/} controller document.
 */
export default class ControllerDocument {

    /**
     * Context for the document.
     */
    '@context': (string | any);

    /**
     * Array of {@link VerificationMethod}.
     */
    public verificationMethods: Array<VerificationMethod> = [];

    /**
     * Constructs a new instance of the class.
     * @param {string} id - for the document.
     */
    constructor (public id: string) {
        // Add the @context to the document using
        // the identifier as the @base.
        this['@context'] =  [
            "https://www.w3.org/ns/did/v1",
            {
                "@base": id
            }
        ]
    }

    /**
     * Adds a verification method to the document and adds a entry for the method in the optionally specified
     * relationship.
     * @param {VerificationMethod} verificationMethod - to add to the instance.
     * @param {Array<VerificationMethodRelationship>}[optional] relationships - for defining the relationship between a DID subject and the {@link VerificationMethod}.
     * @returns {void}.
     */
    public addVerificationMethod (verificationMethod: VerificationMethod, relationships?: Array<VerificationMethodRelationship>): void {

        // If the method does not specify a controller
        // default to the document id.
        if (!verificationMethod.controller) {
            verificationMethod.controller = this.id;
        }

        this.verificationMethods.push(verificationMethod);

        if (Array.isArray(relationships) && relationships.length > 0) {
            relationships.forEach((relationship) => {
                const relationshipArray = this[relationship.toString()];

                // Check if an array has been created already
                if (!Array.isArray(relationshipArray)) {
                    this[relationship.toString()] = [];
                }

                this[relationship.toString()].push(verificationMethod.id);
            });
        }
    }
}
