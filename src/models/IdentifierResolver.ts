// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { IdentifierStore } from './IdentifierStore';
import { ResolveResult } from './ResolveResult';

/**
 * Abtsract class for resolving identifiers.
 */
export abstract class IdentifierResolver {
    /**
     * Looks for the specified controller identifier in the member identifier store that is
     * local to the network.
     * @param {string} [controllerIdentifier] to resolve.
     * @returns {ResolveResult} indicating whether the specified identifier was found on the network
     * and if so its associated controller document.
     */
  public static resolveLocal (controllerIdentifier: string) : ResolveResult {
        // Try read the identifier from the store
    const identifierKeys = new IdentifierStore().read(controllerIdentifier);

    if (identifierKeys) {
      return {
        found: true,
        controllerDocument: identifierKeys.controllerDocument,
      };
    }

        // Identifier not found return false.
    return {
      found: false,
    };
  }
}
