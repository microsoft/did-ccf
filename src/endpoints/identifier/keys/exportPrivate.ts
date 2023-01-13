// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import {
  AuthenticatedRequestError,
  IdentifierNotProvided,
  KeyNotFound,
} from '../../../errors';
import {
  AuthenticatedIdentity,
  IdentifierStore,
  RequestParser,
} from '../../../models';

/**
 * Exports the specified key associated with the controller
 * identifier including the private key.
 * @param {Request} request passed to the API.
 */
export function exportPrivate (request: Request): Response {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const requestParser = new RequestParser(request);
  const identifierId: string = requestParser.identifier;
  const keyIdentifier: string = requestParser.keyIdentifier;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    console.log(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  // Try read the identifier from the store
  try {
    const identifier = new IdentifierStore().read(identifierId, authenticatedIdentity);

    // Get matchedKey
    const matchedKey = identifier.getKeyById(keyIdentifier);
    if (!matchedKey) {
      const keyNotFound = new KeyNotFound(authenticatedIdentity, identifierId, keyIdentifier);
      console.log(keyNotFound);
      return keyNotFound.toErrorResponse();
    }

    return {
      statusCode: 200,
      body: matchedKey,
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
