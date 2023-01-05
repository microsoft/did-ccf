import { IdentifierKeys } from './IdentifierKeys';
import { IdentifierStore } from './IdentifierStore';
import { ResolveResult } from './ResolveResult';

/**
 * Generates an identifier that can be used for uniquely identifying resources.
 */
export abstract class Identifier {
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
                controllerDocument: identifierKeys.controllerDocument
            }
        }

        // Identifier not found return false.
        return {
            found: false
        };
    }
}