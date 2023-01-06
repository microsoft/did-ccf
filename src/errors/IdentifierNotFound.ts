// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';
import { AuthenticatedIdentity } from '../models';

/**
 * Error for indicating that an identifier was not found on the network.
 */
export class IdentifierNotFound extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link IdentifierNotFound} class.
   * @param {string} identifier that could not be found on the network. 
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request.
   */
  constructor (public identifier: string, public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity, 
      ErrorCodes.IdentifierNotFound, 
      `The identifier '${identifier}' not found on the network.`, 
      404);
  }
}
  