// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';

/**
 * Error for indicating that a {@link Service} was not provided in the request.
 */
export class ServiceNotProvided extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link ServiceNotProvided} class.
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity,
      ErrorCodes.InvalidService,
      `User/Member '${authenticatedIdentity.identifier}' submitted a request that did not provide the expected service. See https://www.w3.org/TR/did-core/#services.`,
      400);
  }
}
