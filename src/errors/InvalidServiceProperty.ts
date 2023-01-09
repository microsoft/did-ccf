// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';

/**
 * Error for indicating that the {@link Service} provided in the request
 * does not specify the expected properties.
 */
export class InvalidServiceProperty extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link InvalidServiceProperty} class.
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request.
   * @param {string} expectedProperty missing from the service.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity, public expectedProperty: string) {
    super(
      authenticatedIdentity,
      ErrorCodes.InvalidService,
      `User/Member '${authenticatedIdentity.identifier}' provided a service that did not contain the expected property '${expectedProperty}'. See https://www.w3.org/TR/did-core/#services for expected properties.`,
      400);
  }
}
