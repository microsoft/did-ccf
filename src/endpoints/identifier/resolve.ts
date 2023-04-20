// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import { AuthenticatedRequestError } from '../../errors';
import {
  IdentifierResolver,
  RequestContext,
 } from '../../models';

/**
 * Resolves the specified decentralized identifier.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 Created and the {@link ControllerDocument} for the identifier.
 */
export function resolve (request: Request): Response<any> {
  const context = new RequestContext(request);
  const identifierId = context.identifier;

  try {
    const identifier = IdentifierResolver.resolveLocal(identifierId);

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
