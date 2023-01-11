// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { IdentifierStore } from './IdentifierStore';
import { ResolveResult } from './ResolveResult';

/**
 * Abstract class for resolving identifiers.
 */
export abstract class IdentifierResolver {
  /**
   * Looks for the specified identifier in the identifier store that is
   * local to the network.
   * @param {string} id to resolve.
   * @returns {ResolveResult} indicating whether the specified identifier was found on the network
   * and if so its associated controller document.
   */
  public static resolveLocal (id: string) : ResolveResult {
        // Try read the identifier from the store
    const identifier = new IdentifierStore().read(id);

    if (identifier) {
      return {
        found: true,
        controllerDocument: identifier.controllerDocument,
      };
    }

        // Identifier not found return false.
    return {
      found: false,
    };
  }
}
