// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import { IdentifierNotFound } from '../../errors';
import { AuthenticatedIdentity, IdentifierResolver } from '../../models';

/**
 * Resolves the specified decentralized identifier.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 Created and the {@link ControllerDocument} for the identifier.
 */
export function resolve (request: Request): Response<any> {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const identifierId = decodeURIComponent(request.params.id);

  const resolveResult = IdentifierResolver.resolveLocal(identifierId);
  if (!resolveResult.found) {
    const identifierNotFound = new IdentifierNotFound(identifierId, authenticatedIdentity);
    console.log(identifierNotFound);
    return identifierNotFound.toErrorResponse();
  }

  return {
    statusCode: 200,
    body: resolveResult.controllerDocument,
  };
}
