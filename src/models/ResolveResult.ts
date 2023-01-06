// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { ControllerDocument } from "./ControllerDocument";

/**
* @interface defining the result of a resovle request.
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