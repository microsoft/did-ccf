// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { VerificationMethod } from './VerificationMethod';
import { VerificationMethodRelationship } from './VerificationMethodRelationship';

/**
 * A class for representing a {@link https://www.w3.org/TR/did-core/} controller document.
 */
export class ControllerDocument {
    /**
     * Context for the document.
     */
  public '@context': (string | any);

    /**
     * Array of {@link VerificationMethod}.
     */
  public verificationMethod: VerificationMethod[] = [];

    /**
     * Constructs a new instance of the {@link ControllerDocument} class.
     * @param {string} id - for the document.
     */
  constructor (public id: string) {
        // Add the @context to the document using
        // the identifier as the @base.
    this['@context'] =  [
      'https://www.w3.org/ns/did/v1',
      {
        '@vocab': 'https://github.com/microsoft/did-ccf/blob/main/DID_CCF.md#',
      },
    ];
  }

    /**
     * Adds a verification method to the document and adds a entry for the method in the optionally specified
     * relationship.
     * @param {VerificationMethod} verificationMethod - to add to the instance.
     * @param {Array<VerificationMethodRelationship>}[relationships] - for defining the relationship between a DID subject and the {@link VerificationMethod}.
     * @returns {void}.
     */
  public addVerificationMethod (verificationMethod: VerificationMethod, relationships?: VerificationMethodRelationship[]): void {
        // If the method does not specify a controller
        // default to the document id.
    if (!verificationMethod.controller) {
      verificationMethod.controller = this.id;
    }

    this.verificationMethod.push(verificationMethod);

    if (Array.isArray(relationships) && relationships.length > 0) {
      relationships.forEach((relationship) => {
        const relationshipAsString = relationship.toString();
        const relationshipArray = this[relationshipAsString];

                // Check if an array has been created already
        if (!Array.isArray(relationshipArray)) {
          this[relationshipAsString] = [];
        }

        this[relationshipAsString].push(verificationMethod.id);
      });
    }
  }
}
