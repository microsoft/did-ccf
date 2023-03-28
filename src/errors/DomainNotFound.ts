// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from '../models';
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';

/**
 * Error for indicating that a domain was not found.
 */
export class DomainNotFound extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link DomainNotFound} class.
   * @param {string} name of a domain that could not be found.
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request.
   */
  constructor (public name: string, public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity,
      ErrorCodes.DomainNotFound,
      `The domain '${name}' was not found.`,
      404);
  }
}
