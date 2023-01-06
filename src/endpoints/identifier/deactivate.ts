// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import {
    IdentifierNotFound,
    IdentifierNotProvided,
    InvalidController,
} from '../../errors';
import { AuthenticatedIdentity, IdentifierStore } from '../../models';

/**
 * Deactivates the specified decentralized identifier.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 OK on successful deactivation of the decentralized identifier.
 */
export function deactivate (request: Request): Response<any> {
    // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const controllerIdentifier = decodeURIComponent(request.params.id);

    // Check an identifier has been provided and
    // if not return 400 Bad Request
  if (!controllerIdentifier) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    console.log(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

    // Try read the identifier from the store
  const identifierStore = new IdentifierStore();
  const identifierKeys = identifierStore.read(controllerIdentifier);

    // Try read the identifier from the store
  if (!identifierKeys) {
    const identifierNotFound = new IdentifierNotFound(controllerIdentifier, authenticatedIdentity);
    console.log(identifierNotFound);
    return identifierNotFound.toErrorResponse();
  }

    // Check that the member is the owner of the
    // identifier.
  if (identifierKeys.memberId !== authenticatedIdentity.identifier) {
    const invalidController = new InvalidController(authenticatedIdentity);
        // Log as a warning, since this could be a legitimate client error,
        // but monitor for security.
    console.warn(invalidController);
    return invalidController.toErrorResponse();
  }

    // Remove the controller identifier from the store. This removes
    // the controller document and all associated keys from the store.
  identifierStore.remove(controllerIdentifier);

  return {
    statusCode: 200,
  };
}
