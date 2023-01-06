// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { 
    string as stringConverter, 
    typedKv as keyStore, 
    json as jsonConverter,
    TypedKvMap
} from '@microsoft/ccf-app';
import { IdentifierKeys } from './IdentifierKeys';

/**
 * @class for storing and retrieiving {@link IdentifierKeys} from the
 * network key value store.
 */
export class IdentifierStore {

    /**
     * Instance of the {@link TypedKvMap} representing the
     * network identifier store.
     */
    private store: TypedKvMap<string, IdentifierKeys>;

    /**
     * Constructs a new instance of the {@link IdentifierStore} class.
     */
    constructor() {
        this.store = keyStore('identifier_store', stringConverter, jsonConverter<IdentifierKeys>());
    }

    /**
     * Adds or updates the specified keys to the store using the specified identifier
     * as the key for the pair. If a pair for the identifier does not exist the pair
     * is added to the store, otherwise the pair is updated.
     * @param {string} identifier for the keys being added to the store or updated.
     * @param {IdentifierKeys} keys associated with the identifier.  
     */
    public addOrUpdate (identifier: string, keys: IdentifierKeys ) : void {
      this.store.set(identifier, keys);
    }

    /**
     * Returns the number of identifiers in the store. This is for all members.
     * @returns {number} indicating the number of identifiers in the store
     * @todo add method for countByMember.
     */
    public count(): number {
      return this.store.size;
    }

    /**
     * Reads the keys associated with the specified identifier from the store.
     * @param {string} identifier for the keys being read from the store.
     * @returns a {@link IdentifierKeys} instance for the identifier if found
     * otherwise void.
     */
    public read (identifier: string ) : IdentifierKeys | void {
      const identifierKeys = this.store.get(identifier)
      
      if (identifierKeys) {
        return Object.setPrototypeOf(identifierKeys, IdentifierKeys.prototype);
      }
      
      return;
    }

    /**
     * Removes the identifier and its associated keys from the store.
     * @param {string} identifier being removed from the store.
     */
    public remove (identifier: string ) : void {
      this.store.delete(identifier);
    }
}