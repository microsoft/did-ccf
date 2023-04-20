// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import {
  AuthenticatedRequestError,
  IdentifierNotProvided,
  ServiceIdentifierNotProvided,
} from '../../../errors';
import {
  AuthenticatedIdentity,
  ControllerDocument,
  IdentifierStore,
  RequestContext,
} from '../../../models';

/**
 * Removes the specified service from the controller document.
 * @param {Request} request passed to the API.
 */
export function remove (request: Request): Response {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const context = new RequestContext(request);
  const identifierId: string = context.identifier;
  const service: string = context.serviceIdentifier;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    context.logger.info(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  // Check a service has been provided
  if (!service) {
    const serviceNotProvided = new ServiceIdentifierNotProvided(authenticatedIdentity);
    context.logger.info(serviceNotProvided);
    return serviceNotProvided.toErrorResponse();
  }

  try {
    // Try read the identifier from the store
    const identifierStore = new IdentifierStore();
    const identifier = identifierStore.read(identifierId, authenticatedIdentity);

    // Get the controller document for the identifier and
    // then removes the service. Calls to remove should be
    // idempotent, but we don't want to incur the write
    // cost every time. Check if the specified service exists
    // and if so remove and update the store, otherwise
    // just return.
    const controllerDocument: ControllerDocument = Object.setPrototypeOf(identifier.controllerDocument, ControllerDocument.prototype);

    if (controllerDocument.hasService(service)) {
      controllerDocument.removeService(service);

      // Update the identifier and update store
      identifier.controllerDocument = controllerDocument;
      identifierStore.addOrUpdate(identifier);
    }

    return {
      statusCode: 200,
      body: identifier.controllerDocument,
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
