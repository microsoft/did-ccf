import { ControllerDocument } from "./ControllerDocument";

/**
* Interface defining the result of a resovle request.
*/
export  interface ResolveResult {
/**
 * The flag indicating whether the identifier was
 * found on the network.
 */
found: boolean;

/**
 * The document for the specified identifier.
 */
controllerDocument?: ControllerDocument;
}