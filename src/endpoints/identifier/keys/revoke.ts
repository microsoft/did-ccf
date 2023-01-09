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
  RequestParser,
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
  const requestParser = new RequestParser(request);
  const identifierId: string = requestParser.identifier;
  const keyIdentifier: string = requestParser.keyIdentifier;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    console.log(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  const identifierStore = new IdentifierStore();

  // Try read the identifier from the store
  const identifier = identifierStore.read(identifierId);
  if (!identifier) {
    const identifierNotFound = new IdentifierNotFound(identifierId, authenticatedIdentity);
    console.log(identifierNotFound);
    return identifierNotFound.toErrorResponse();
  }

  // Get the current key from the members keys then
  // 1. Update the state to revoked
  // 2. Remove the private key
  // 3. Remove key entry from controller document
  // Get matchedKey
  const matchedKey = identifier.getKeyById(keyIdentifier);
  if (!matchedKey) {
    const keyNotFound = new KeyNotFound(authenticatedIdentity, identifierId, keyIdentifier);
    console.log(keyNotFound);
    return keyNotFound.toErrorResponse();
  }

  matchedKey.state = KeyState.Revoked;
  delete matchedKey.privateKey;

  // Remove the method from the verification methods array
  let verificationMethod = identifier.controllerDocument.verificationMethod;
  verificationMethod = verificationMethod.filter(verificationMethod => verificationMethod.id !== keyIdentifier);

  // Now remove from any references from relationships. Use the
  // enum values since the document relationships begin lower case.
  Object.values(VerificationMethodRelationship).forEach(relationship => {
    if (identifier.controllerDocument.hasOwnProperty(relationship)) {
      identifier.controllerDocument[relationship] = identifier.controllerDocument[relationship].filter(reference => reference !== keyIdentifier);
    }
  });

  // Store the updated controller document and identifier keys
  identifierStore.addOrUpdate(identifier);

  // Return 201 and the controller document representing the updated controller document.
  return {
    statusCode: 200,
    body: identifier.controllerDocument,
  };
}
