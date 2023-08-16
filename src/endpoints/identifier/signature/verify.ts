// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
    Request,
    Response,
    string as stringConverter,
  } from '@microsoft/ccf-app';
import {
    SigningAlgorithm,
    verifySignature,
} from '@microsoft/ccf-app/crypto';
import {
    AlgorithmName,
} from '@microsoft/ccf-app/global';
import { Base64 } from 'js-base64';
import {
    AuthenticatedRequestError,
    IdentifierNotProvided,
    KeyNotConfigured,
    PayloadNotProvided,
    SignatureNotProvided,
    SignerIdentifierNotProvided,
} from '../../../errors';
import {
    AuthenticatedIdentity,
    IdentifierStore,
    KeyUse,
    RequestContext,
    SignedPayload,
} from '../../../models';

/**
 * Verifies the signature for the specified payload.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 OK and a boolean indicating whether the signature is valid.
 */
export function verify (request: Request): Response<any> {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const context = new RequestContext(request);
  const identifierId = context.identifier;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    context.logger.warn(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  // Get the signature and payload from
  // the body JSON and validate before we do any
  // real work.
  let bodyJson: SignedPayload;
  if (authenticatedIdentity.policy === 'user_cose_sign1') {
    bodyJson = JSON.parse(authenticatedIdentity.coseBody);
  } else {
    bodyJson = request.body.json();
  }

  const signatureBase64 = bodyJson.signature;
  const payload = bodyJson.payload;
  const signerIdentifier = bodyJson.signer;

  if (!signatureBase64 || signatureBase64.length === 0) {
    const signatureNotProvided = new SignatureNotProvided(authenticatedIdentity);
    context.logger.warn(signatureNotProvided);
    return signatureNotProvided.toErrorResponse();
  }

  if (!payload || payload.length === 0) {
    const payloadNotProvided = new PayloadNotProvided(authenticatedIdentity);
    context.logger.warn(payloadNotProvided);
    return payloadNotProvided.toErrorResponse();
  }

  if (!signerIdentifier || signerIdentifier.length === 0) {
    const signerIdentifierNotProvided = new SignerIdentifierNotProvided(authenticatedIdentity);
    context.logger.warn(signerIdentifierNotProvided);
    return signerIdentifierNotProvided.toErrorResponse();
  }

  try {
    // Once we have checked all the necessary parameters and
    // are good, try and read the identifier from the store.
    const checkIsController = false;
    const identifier = new IdentifierStore().read(identifierId, authenticatedIdentity, checkIsController);

    // Get the current signing key and return error if
    // one is not returned.
    const currentKey = identifier.getCurrentKey(KeyUse.Signing);
    if (!currentKey) {
      const keyNotConfigured = new KeyNotConfigured(authenticatedIdentity, identifierId);
      // Log as an error since this is not
      // a client recoverable error.
      context.logger.error(keyNotConfigured);
      return keyNotConfigured.toErrorResponse();
    }

    const signingAlgorithm: SigningAlgorithm = {
      name: <AlgorithmName>currentKey.algorithm.toString(),
      hash: 'SHA-256',
    };

    // Encode the payload, convert the base64URL encoded
    // signature to an array and verify signature
    const signature = Base64.toUint8Array(signatureBase64);
    const isSignatureValid = verifySignature(
      signingAlgorithm,
      currentKey.publicKey,
      signature.buffer,
      stringConverter.encode(payload));

    return {
      statusCode: 200,
      body: isSignatureValid,
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
