import { Request, Response } from '@microsoft/ccf-app';
import { 
  IdentifierNotFound, 
  IdentifierNotProvided, 
  KeyNotFound 
} from '../../../errors';
import { AuthenticatedIdentity, IdentifierStore } from '../../../models';

/**
 * Exports the specified key associated with the controller
 * identifier including the private key.
 * @param {Request} request passed to the API.
 */
export function exportPrivate (request: Request): Response {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const controllerIdentifier: string = decodeURIComponent(request.params.id);
  const keyIdentifier: string = decodeURIComponent(request.params.kid);

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!controllerIdentifier) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    console.log(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  // Try read the identifier from the store
  const identifierKeys = new IdentifierStore().read(controllerIdentifier);
  if (!identifierKeys) {
    const identifierNotFound = new IdentifierNotFound(controllerIdentifier, authenticatedIdentity);
    console.log(identifierNotFound);
    return identifierNotFound.toErrorResponse();
  }

  // Get matchedKey
  const matchedKey = identifierKeys.getKeyById(keyIdentifier);
  if (!matchedKey) {
    const keyNotFound = new KeyNotFound(authenticatedIdentity, controllerIdentifier, keyIdentifier);
    console.log(keyNotFound);
    return keyNotFound.toErrorResponse();
  }

  return {
    statusCode: 200,
    body: matchedKey
  }
}
