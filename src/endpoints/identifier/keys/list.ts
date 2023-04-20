// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import { AuthenticatedRequestError, IdentifierNotProvided } from '../../../errors';
import {
  AuthenticatedIdentity,
  IdentifierStore,
  RequestContext,
} from '../../../models';

/**
 * Lists the keys associated with the controller identifier.
 * @param {Request} request passed to the API.
 */
export function list (request: Request): Response {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const context = new RequestContext(request);
  const identifierId: string = context.identifier;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    context.logger.info(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  // Try read the identifier from the store
  try {
    const identifier = new IdentifierStore().read(identifierId, authenticatedIdentity);

    // Remove the private keys from the collection before
    // returning id, public key and state
    const keys = identifier.keyPairs.map<any>(keyPair => {
      const { privateKey, ...redactedKey } = keyPair;
      return redactedKey;
    });

    return {
      statusCode: 200,
      body: {
        keys,
      },
    };
  } catch (error) {
    if (error instanceof AuthenticatedRequestError) {
      return (<AuthenticatedRequestError>error).toErrorResponse();
    }

    // Not derived from `AuthenticatedRequestError`
    // so throw.
    throw (error);
  }
}
