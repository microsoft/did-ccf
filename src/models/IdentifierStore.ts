// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
    json as jsonConverter,
    string as stringConverter,
    typedKv as keyStore,
    TypedKvMap,
} from '@microsoft/ccf-app';
import { Identifier } from './Identifier';

/**
 * A class for storing and retrieiving {@link IdentifierKeys} from the
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
   * specified id.
   * @param {string} id for the identifier being read from the store.
   * @returns a {@link Identifier} instance for the identifier if found
   * otherwise void.
   */
  public read (id: string) : Identifier | void {
    const identifier = this.store.get(id);

    if (identifier) {
      return Object.setPrototypeOf(identifier, Identifier.prototype);
    }

    return;
  }

  /**
   * Removes the identifier and its associated keys from the store.
   * @param {string} identifier being removed from the store.
   */
  public remove (identifier: string) : void {
    this.store.delete(identifier);
  }
}
