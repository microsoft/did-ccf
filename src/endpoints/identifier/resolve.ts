import { Request, Response } from '@microsoft/ccf-app';
import { IdentifierNotFound, IdentifierNotProvided, } from '../../errors';
import { AuthenticatedIdentity, Identifier } from '../../models';

/**
 * Resolves the specified decentralized identifier.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 Created and the {@link ControllerDocument} for the identifier.
 */
export function resolve (request: Request): Response<any> {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const controllerIdentifier = decodeURIComponent(request.params.id);

  const resolveResult = Identifier.resolveLocal(controllerIdentifier);
  if (!resolveResult.found) {
    const identifierNotFound = new IdentifierNotFound(controllerIdentifier, authenticatedIdentity);
    console.log(identifierNotFound);
    return identifierNotFound.toErrorResponse();
  }

  return {
    statusCode: 200,
    body: resolveResult.controllerDocument
  };
}
