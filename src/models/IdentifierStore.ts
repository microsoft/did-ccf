// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
    json as jsonConverter,
    string as stringConverter,
    typedKv as keyStore,
    TypedKvMap,
} from '@microsoft/ccf-app';
import { IdentifierNotFound } from '../errors/IdentifierNotFound';
import { InvalidController } from '../errors/InvalidController';
import { AuthenticatedIdentity } from './AuthenticatedIdentity';
import { Identifier } from './Identifier';

/**
 * A class for storing and retrieving {@link IdentifierKeys} from the
 * network key value store.
 */
export class IdentifierStore {
  /**
   * Instance of the {@link TypedKvMap} representing the
   * network identifier store.
   */
  private store: TypedKvMap<string, Identifier>;

  /**
   * Constructs a new instance of the {@link IdentifierStore} class.
   */
  constructor () {
    this.store = keyStore('identifier_store', stringConverter, jsonConverter<Identifier>());
  }

  /**
   * Adds or updates the specified identifier along with its controller document
   * and keys.
   * @param {Identifier} identifier being added or updated.
   */
  public addOrUpdate (identifier: Identifier) : void {
    this.store.set(identifier.id, identifier);
  }

  /**
   * Returns the number of identifiers in the store. This is for all members.
   * @returns {number} indicating the number of identifiers in the store
   * @todo add method for countByMember.
   */
  public count (): number {
    return this.store.size;
  }

  /**
   * Attempts to read the {@link Identifier} from the store using the
   * specified id, checking to see if the authenticated identity
   * is the controller of the identifier.
   * @param {string} id for the identifier being read from the store.
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request to read from the store.
   * @param {boolean} [checkControl=true] indicating whether to check that the provided
   * authenticated identity is the controller of the document.
   * @returns a {@link Identifier} instance for the identifier if found
   * otherwise void.
   */
  public read (id: string, authenticatedIdentity: AuthenticatedIdentity, checkControl: boolean = true) : Identifier {
    let identifier = this.store.get(id);

    if (!identifier) {
      const identifierNotFound = new IdentifierNotFound(id, authenticatedIdentity);
      console.log(identifierNotFound);
      throw identifierNotFound;
    }

    // As part of the restructuring of IdentifierKeys to Identifier,
    // have introduced id as a top level property. Old stored identifiers
    // will not have this top level property so check and update if
    // that is the case.
    if (!identifier.hasOwnProperty('id')) {
      identifier.id = id;
    }

    identifier = Object.setPrototypeOf(identifier, Identifier.prototype);

    // Now check that the authenticated identity is the controller.
    if (checkControl && !identifier.isController(authenticatedIdentity)) {
      const invalidController = new InvalidController(authenticatedIdentity);
      // Log as a warning, since this could be a legitimate client error,
      // but monitor for security.
      console.warn(invalidController);
      throw invalidController;
    }

    return identifier;
  }

  /**
   * Removes the identifier and its associated keys from the store.
   * @param {string} identifier being removed from the store.
   */
  public remove (identifier: string) : void {
    this.store.delete(identifier);
  }
}
