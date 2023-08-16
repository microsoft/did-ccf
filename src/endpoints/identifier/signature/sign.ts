// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
    Request,
    Response,
    string as stringConverter,
  } from '@microsoft/ccf-app';
import {
    sign as createSignature,
    SigningAlgorithm,
} from '@microsoft/ccf-app/crypto';
import {
    AlgorithmName,
} from '@microsoft/ccf-app/global';
import { Base64 } from 'js-base64';
import {
    AuthenticatedRequestError,
    IdentifierNotProvided,
    InvalidController,
    KeyNotConfigured,
    PayloadNotProvided,
} from '../../../errors';
import {
    AuthenticatedIdentity,
    IdentifierStore,
    KeyUse,
    RequestContext,
    SignedPayload,
} from '../../../models';

/**
 * Signs the payload using the current signing key associated with the controller identifier.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 OK and a {@link SignedPayload}.
 */
export function sign (request: Request): Response<any> {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const context = new RequestContext(request);
  const identifierId = context.identifier;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!identifierId) {
    const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
    context.logger.info(identifierNotProvided);
    return identifierNotProvided.toErrorResponse();
  }

  // Read the text from the request and validate
  // before we do any work retrieving keys.
  let payload : string;
  if (authenticatedIdentity.policy === 'user_cose_sign1') {
    payload = authenticatedIdentity.coseBody;
  } else {
    payload = request.body.text();
  }

  if (!payload || payload.length === 0) {
    const payloadNotProvided = new PayloadNotProvided(authenticatedIdentity);
    context.logger.info(payloadNotProvided);
    return payloadNotProvided.toErrorResponse();
  }

  try {
    // Try read the identifier from the store
    const identifier = new IdentifierStore().read(identifierId, authenticatedIdentity);

    // Get the current signing key and return error if
    // one is not returned.
    const currentKey = identifier.getCurrentKey(KeyUse.Signing);
    if (!currentKey) {
      const keyNotConfigured = new KeyNotConfigured(authenticatedIdentity, identifierId);
      // Send to the console as an error since this is not
      // a client recoverable error.
      console.error(keyNotConfigured);
      return keyNotConfigured.toErrorResponse();
    }

    const signingAlgorithm: SigningAlgorithm = {
      name: <AlgorithmName>currentKey.algorithm.toString(),
      hash: 'SHA-256',
    };

    // Encode the payload, generate the signature and
    // then convert to a Base64URL encoded string
    const payloadBuffer = stringConverter.encode(payload);
    const signatureBuffer = createSignature(signingAlgorithm, currentKey.privateKey, payloadBuffer);
    const signature = Base64.fromUint8Array(new Uint8Array(signatureBuffer), true);

    return {
      statusCode: 200,
      body: <SignedPayload> {
        signature,
        algorithm: signingAlgorithm,
        keyIdentifier: currentKey.id,
      },
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
