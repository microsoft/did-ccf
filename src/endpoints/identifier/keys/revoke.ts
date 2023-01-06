// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import {
  IdentifierNotFound,
  IdentifierNotProvided,
  KeyNotFound,
} from '../../../errors';
import {
  AuthenticatedIdentity,
  IdentifierStore,
  KeyState,
  VerificationMethodRelationship,
} from '../../../models';

/**
 * Revokes the specified key pair associated with the controller
 * identifier.
 * @param {Request} request passed to the API.
 */
export function revoke (request: Request): Response {
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

  const identifierStore = new IdentifierStore();

  // Try read the identifier from the store
  const identifierKeys = identifierStore.read(controllerIdentifier);
  if (!identifierKeys) {
    const identifierNotFound = new IdentifierNotFound(controllerIdentifier, authenticatedIdentity);
    console.log(identifierNotFound);
    return identifierNotFound.toErrorResponse();
  }

  // Get the current key from the members keys then
  // 1. Update the state to revoked
  // 2. Remove the private key
  // 3. Remove key entry from controller document
  // Get matchedKey
  const matchedKey = identifierKeys.getKeyById(keyIdentifier);
  if (!matchedKey) {
    const keyNotFound = new KeyNotFound(authenticatedIdentity, controllerIdentifier, keyIdentifier);
    console.log(keyNotFound);
    return keyNotFound.toErrorResponse();
  }

  matchedKey.state = KeyState.Revoked;
  delete matchedKey.privateKey;

  // Remove the method from the verification methods array
  let verificationMethod = identifierKeys.controllerDocument.verificationMethod;
  verificationMethod = verificationMethod.filter(verificationMethod => verificationMethod.id !== keyIdentifier);

  // Now remove from any references from relationships. Use the
  // enum values since the document relationships begin lower case.
  Object.values(VerificationMethodRelationship).forEach(relationship => {
    if (identifierKeys.controllerDocument.hasOwnProperty(relationship)) {
      identifierKeys.controllerDocument[relationship] = identifierKeys.controllerDocument[relationship].filter(reference => reference !== keyIdentifier);
    }
  });

  // Store the updated controller document and identifier keys
  identifierStore.addOrUpdate(controllerIdentifier, identifierKeys);

  // Return 201 and the controller document representing the updated controller document.
  return {
    statusCode: 200,
    body: identifierKeys.controllerDocument,
  };
}
