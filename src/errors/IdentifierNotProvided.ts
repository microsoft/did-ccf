// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';

/**
 * Error for indicating that an identifier has not been provided
 * as part of the request.
 */
export class IdentifierNotProvided extends AuthenticatedRequestError {
  /**
   * The http status for the error.
   */
  public readonly httpStatus = 400;

  /**
   * Constructs a new instance of the {@link IdentifierNotProvided} class.
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity,
      ErrorCodes.IdentifierNotProvided,
      `User/Member '${authenticatedIdentity.identifier}' submitted a request that did not provide the expected identifier parameter.`,
      400);
  }
}
