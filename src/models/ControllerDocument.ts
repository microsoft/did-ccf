// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Service } from './Service';
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
   * Array of {@link Service}'s used to express ways of communicating with
   * the DID subject or associated entities. A service can be any type of
   * service the DID subject wants to advertise, including decentralized
   * identity management services for further discovery, authentication,
   * authorization, or interaction.
   */
  public service: Service[];

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
   * @param {VerificationMethod} verificationMethod to add to the controller document.
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

  /**
   * Adds or updates the specified service to the array of services
   * in the controller document.
   * @param {Service} service to add or update.
   * @returns {void}.
   */
  public addOrUpdateService (service: Service): void {
    // If the instance has been deserialized from the store,
    // the service array might not be initialized.
    // Check if this is the case and if so initialize.
    if (!this.hasOwnProperty('service')) {
      this.service = [];
    }

    // Check if the service already exists and if
    // so update rather than push.
    const existingServiceIndex = this.service.findIndex(existing => existing.id === service.id);

    if (existingServiceIndex > -1) {
      this.service[existingServiceIndex] = service;
    } else {
      this.service.push(service);
    }
  }

  /**
   * Removes the specified service from the array of services
   * in the controller document.
   * @param {string} id of the service being removed.
   * @returns {void}.
   */
  public removeService (id: string): void {
    // Check if the service exists and if
    // so remove from the array.
    const existingServiceIndex = this.service?.findIndex(existing => existing.id === id);

    if (existingServiceIndex > -1) {
      this.service.splice(existingServiceIndex, 1);
    }
  }

  /**
   * Checks the service array to see if the specified service exists.
   * @param {string} id of the service being checked.
   * @returns {boolean} true if the service exists in the services array, otherwise false.
   */
  public hasService (id: string): boolean {
    // Check if the service exists and if
    // so remove from the array.
    return this.service?.findIndex(existing => existing.id === id) > -1;
  }
}
