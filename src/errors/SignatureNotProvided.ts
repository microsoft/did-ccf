// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';

/**
 * Error for indicating that a signature has not been provided
 * as part of the request.
 */
export class SignatureNotProvided extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link SignatureNotProvided} class.
   * @param {AuthenticatedIdentity} authenicatedIdentity making the request.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity, 
      ErrorCodes.SignatureNotProvided, 
      `User/Member '${authenticatedIdentity.identifier}' submitted a request that did not provide the expected signature to verify. Signature, payload and signer identifier are required.`,
      400);
  }
}
  