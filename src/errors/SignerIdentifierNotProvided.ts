// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';

/**
 * Error for indicating that the identifier of the signer has not been provided
 * as part of the request.
 */
export class SignerIdentifierNotProvided extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link SignerIdentifierNotProvided} class.
   * @param {AuthenticatedIdentity} authenicatedIdentity making the request.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity,
      ErrorCodes.SignatureNotProvided,
      `User/Member '${authenticatedIdentity.identifier}' submitted a request that did not provide the expected signer's identifier. Signature, payload and signer identifier are required.`,
      400);
  }
}
