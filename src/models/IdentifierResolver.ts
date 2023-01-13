// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from './AuthenticatedIdentity';
import { Identifier } from './Identifier';
import { IdentifierStore } from './IdentifierStore';

/**
 * Class for resolving identifiers.
 */
export class IdentifierResolver {
  /**
   * Looks for the specified identifier in the identifier store that is
   * local to the network.
   * @param {string} id to resolve.
   * @returns {ResolveResult} indicating whether the specified identifier was found on the network
   * and if so its associated controller document.
   */
  public static resolveLocal (id: string) : Identifier {
    // Try read the identifier from the store passing
    // in an instance of the `no_auth` authenticated identity
    // and explicitly overriding the controller check by passing
    // in the checkControl parameter as `false`.
    return new IdentifierStore().read(id, new AuthenticatedIdentity({ policy: 'no_auth' }), false);
  }
}
