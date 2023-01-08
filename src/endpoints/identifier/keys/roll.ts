// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import {
  IdentifierNotFound,
  IdentifierNotProvided,
  InvalidController,
  KeyNotConfigured,
} from '../../../errors';
import {
  AuthenticatedIdentity,
  ControllerDocument,
  EcdsaCurve,
  EddsaCurve,
  IdentifierStore,
  KeyAlgorithm,
  KeyPair,
  KeyPairCreator,
  KeyState,
  KeyUse,
  QueryStringParser,
  VerificationMethodRelationship,
  VerificationMethodType,
} from '../../../models';

/**
 * Rolls the current key pair associated with the controller
 * identifier using the existing key algorihtm as the
 * algorithm. The request querystring paramtere
 * @param {Request} request passed to the API.
 *
 * @description The following optional query string parameters
 * can be provided in the request:
 *
 *    @param {KeyAlgorithm} alg specifying the key algorithm to use.
 *    @param {number} size specifying the key size.
 *    @param {EcdsaCurve} curve specifying the key size.
 *    @param {KeyUse} use specifying the key use.
 */

export function roll (request: Request): Response {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const identifierId: string = decodeURIComponent(request.params.id);
  const queryParams = new QueryStringParser(request.query);

  // Get the optional parameters from the request
  const keyUse: KeyUse = <KeyUse>queryParams['use'] || KeyUse.Signing;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    console.log(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  // Try read the identifier from the store
  const identifierStore = new IdentifierStore();

  // Try read the identifier from the store
  const identifier = identifierStore.read(identifierId);
  if (!identifier) {
    const identifierNotFound = new IdentifierNotFound(identifierId, authenticatedIdentity);
    console.log(identifierNotFound);
    return identifierNotFound.toErrorResponse();
  }

  // Check that the member is the controller of the
  // identifier.
  if (!identifier.isController(authenticatedIdentity)) {
    const invalidController = new InvalidController(authenticatedIdentity);
    console.log(invalidController);
    return invalidController.toErrorResponse();
  }

  // Get the current key for the specified use from the members keys then
  // 1. Get the current key, check if the same key type is being generated as part of the roll. If there
  // is no current key todays behaviour is to throw, but perhaps it should just create a new key (could
  // be enabled by a query parameter?).
  // 2. Generate the new key.
  // 3. Update the current key state to historical.
  // 4. Remove the current key's private key.
  const currentKey = identifier.getCurrentKey(keyUse);

  if (!currentKey) {
    const keyNotConfigured = new KeyNotConfigured(authenticatedIdentity, identifierId, keyUse);
    // Send to the console as an error since this is not a client recoverable error.
    console.error(keyNotConfigured);
    return keyNotConfigured.toErrorResponse();
  }

  // We have macthed an identifier, so let's parse the
  // query string to see if any alg and curve params
  // have been specified. If not just use the properties
  // of the existing key.
  const algorithm: KeyAlgorithm = <KeyAlgorithm>queryParams['alg'] || currentKey.algorithm;
  const size: number = Number.parseInt(queryParams['size']) || currentKey.size;
  const curve: EcdsaCurve | EddsaCurve = <EcdsaCurve>queryParams['curve'] || currentKey?.curve;

  // Now generate the new key
  const newKey: KeyPair = KeyPairCreator.createKey(algorithm, keyUse, size, curve);

  // Update the current key state and delete private key
  currentKey.state = KeyState.Historical;
  delete currentKey.privateKey;

  // Now add the new keys to the member
  identifier.keyPairs.push(newKey);

  // Add the new verification method to the controller document
  // and then update the store
  const controllerDocument = Object.setPrototypeOf(identifier.controllerDocument, ControllerDocument.prototype);
  const verificationMethodRelationship =
    keyUse === KeyUse.Signing ?
    VerificationMethodRelationship.Authentication :
    VerificationMethodRelationship.KeyAgreement;

  controllerDocument.addVerificationMethod({
    id: newKey.id,
    controller: identifier.controllerDocument.id,
    type: VerificationMethodType.JsonWebKey2020,
    publicKeyJwk: newKey.asJwk(false),
  }, [verificationMethodRelationship]);

  // Store the new identifier
  identifierStore.addOrUpdate(identifier);

  // Return 201 and the controller document representing the updated controller document.
  return {
    statusCode: 201,
    body: identifier.controllerDocument,
  };
}
