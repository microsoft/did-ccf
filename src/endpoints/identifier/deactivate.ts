// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import {
    AuthenticatedRequestError,
    IdentifierNotProvided,
} from '../../errors';
import {
  AuthenticatedIdentity,
  IdentifierStore,
  RequestParser,
 } from '../../models';

/**
 * Deactivates the specified decentralized identifier.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 OK on successful deactivation of the decentralized identifier.
 */
export function deactivate (request: Request): Response<any> {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const requestParser = new RequestParser(request);
  const identifierId = requestParser.identifier;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    console.log(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  try {
    // Try read the identifier from the store checking that
    // the authenticated identity is the controller
    const identifierStore = new IdentifierStore();
    identifierStore.read(identifierId, authenticatedIdentity);

    // Remove the controller identifier from the store. This removes
    // the controller document and all associated keys from the store.
    identifierStore.remove(identifierId);

    return {
      statusCode: 200,
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
