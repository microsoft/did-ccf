// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';

/**
 * Error for indicating that a request did not include the service identifier
 * in the path or the service identifier was white-space.
 */
export class ServiceIdentifierNotProvided extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link ServiceIdentifierNotProvided} class.
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity,
      ErrorCodes.ServiceIdentifierNotProvided,
      `User/Member '${authenticatedIdentity.identifier}' submitted a request that did not provide service identifier in the path.`,
      400);
  }
}
