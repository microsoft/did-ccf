// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { KeyUse } from '../models';
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';
import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';

/**
 * Error for indicating that an identifier does not have
 * a configured (current) key.
 */
export class KeyNotConfigured extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link KeyNotConfigured} class.
   * @param {AuthenticatedIdentity} authenticatedIdentity performing the key operation.
   * @param {string} identifier that does not have a configured (current) signing key.
   * @param {KeyUse} [use=KeyUse.Signing] indicating what the key can be used for.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity, public identifier: string, public use: KeyUse = KeyUse.Signing) {
    super(
      authenticatedIdentity,
      ErrorCodes.SigningKeyNotConfigured,
      `User/Member '${authenticatedIdentity.identity}' is attempting to use identifier '${identifier}' that does have a current key '${use}' configured.`);
  }
}
