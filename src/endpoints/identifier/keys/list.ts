import { Request, Response} from '@microsoft/ccf-app';
import { IdentifierNotFound, IdentifierNotProvided } from '../../../errors';
import {
  AuthenticatedIdentity,
  IdentifierStore
} from '../../../models';

/**
 * Lists the keys associated with the controller identifier.
 * @param {Request} request passed to the API.
 */
export function list (request: Request): Response {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const controllerIdentifier: string = decodeURIComponent(request.params.id);
  
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

  // Remove the private keys from the collection before
  // returning id, public key and state
  const keys = identifierKeys.keyPairs.map<any>(keyPair => { 
      let {privateKey, ...redactedKey} = keyPair;
      return redactedKey;
  });

  return {
    statusCode: 200,
    body: {
        keys: keys
    }
  }
}
