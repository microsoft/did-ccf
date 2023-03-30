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
 * Encapsulates a domain
 */
export class Domain {
  private kv: TypedKvMap<string, any>;

  /**
   * Constructs a new instance of the class.
   * @param name the domain's name (e.g. example.com)
   */
  constructor (public name: string) {
    this.kv = keyStore(this.name, stringConverter, jsonConverter<any>());
  }

  /**
   * Indicates whether the named domain is registered, or not
   */
  public get isRegistered (): boolean {
    const kv = keyStore('public:ccf.gov.did.domains', stringConverter, jsonConverter<Domain>());
    return (kv.has(this.name));
  }

  /**
   * Persistently maps the given identifer to the enclosing domain
   * @param identifier an identifier to add under the domain
   */
  public add (identifier: Identifier): void {
    // For now, just store an empty object as the value
    const value = {};
    this.kv.set(identifier.id, value);
  }

  /**
   * Removes the given identifier from the enclosing domain
   * @param identifier the identifier to remove from the domain
   */
  public remove (identifier: Identifier): void {
    const key = identifier.id;
    if (this.kv.has(key)) {
      this.kv.delete(key);
    }
  }
}
