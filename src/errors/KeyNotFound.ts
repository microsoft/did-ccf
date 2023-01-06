// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';

/**
 * Error for indicating that a specified key was not found in the
 * identifiers list of keys.
 */
export class KeyNotFound extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link KeyNotFound} class.
   * @param {AuthenticatedIdentity} authenicatedIdentity making the request.
   * @param {string} identifier that does not have the specified key in it's key list.
   * @param {string} keyIdentifier that resulted in the error.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity, public identifier: string, public keyIdentifier: string) {
    super(
      authenticatedIdentity, 
      ErrorCodes.KeyNotFound, 
      `User/Member '${authenticatedIdentity.identifier}' has tried to perform a key operation on key '${keyIdentifier}', but the key does not exist in identifiers '${identifier}' keys.`,
      400);
  }
}
  