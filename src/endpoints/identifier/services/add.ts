// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import {
  AuthenticatedRequestError,
  IdentifierNotProvided,
  InvalidServiceProperty,
  ServiceNotProvided,
} from '../../../errors';
import {
  AuthenticatedIdentity,
  ControllerDocument,
  IdentifierStore,
  RequestContext,
} from '../../../models';
import { Service } from '../../../models/Service';

/**
 * Adds the provided service to the controller document.
 * @param {Request} request passed to the API.
 */
export function add (request: Request): Response {
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

  // Get the service JSON from the request and check that
  // is correctly formed.
  const service = <Service>request.body.json();

  if (!service) {
    const serviceNotProvided = new ServiceNotProvided(authenticatedIdentity);
    context.logger.info(serviceNotProvided);
    return serviceNotProvided.toErrorResponse();
  }

  if (!service.id) {
    const invalidService = new InvalidServiceProperty(authenticatedIdentity, 'id');
    context.logger.info(invalidService);
    return invalidService.toErrorResponse();
  }

  if (!service.type) {
    const invalidService = new InvalidServiceProperty(authenticatedIdentity, 'type');
    context.logger.info(invalidService);
    return invalidService.toErrorResponse();
  }

  if (!service.serviceEndpoint) {
    const invalidService = new InvalidServiceProperty(authenticatedIdentity, 'serviceEndpoint');
    context.logger.info(invalidService);
    return invalidService.toErrorResponse();
  }

  try {
    // Try read the identifier from the store
    const identifierStore = new IdentifierStore();
    const identifier = identifierStore.read(identifierId, authenticatedIdentity);

    // Get the controller document for the identifier and
    // then adds or updates the service
    const controllerDocument: ControllerDocument = Object.setPrototypeOf(identifier.controllerDocument, ControllerDocument.prototype);
    controllerDocument.addOrUpdateService(service);

    // Update the identifier and write to store
    identifier.controllerDocument = controllerDocument;
    identifierStore.addOrUpdate(identifier);

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
