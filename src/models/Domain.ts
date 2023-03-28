// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
  json as jsonConverter,
  string as stringConverter,
  typedKv as keyStore,
} from '@microsoft/ccf-app';

/**
 * Encapsulates a domain
 */
export class Domain {
  /**
   * Constructs a new instance of the class.
   * @param name the domain's name (e.g. example.com)
   */
  constructor (public name: string) {
  }

  /**
   * Returns true if a domain with the given name has been registered
   * @param name the name of a domain
   */
  public static isRegistered (name: string) : boolean {
    const normalized = name.trim().toLowerCase();
    const kv = keyStore('public:ccf.gov.did.domains', stringConverter, jsonConverter<Domain>());
    return kv.has(normalized);
  }
}
