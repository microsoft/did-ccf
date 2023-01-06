// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
    Request, 
    Response,
    string as stringConverter 
  } from '@microsoft/ccf-app';
import { 
    SigningAlgorithm, 
    sign as createSignature
} from '@microsoft/ccf-app/crypto';
import { 
    AlgorithmName
} from '@microsoft/ccf-app/global';
import { Base64 } from 'js-base64';
import { 
    IdentifierNotFound,
    IdentifierNotProvided,
    KeyNotConfigured,
    PayloadNotProvided
} from '../../../errors';
import { 
    AuthenticatedIdentity,
    IdentifierStore,
    KeyUse,
    SignedPayload 
} from '../../../models';

/**
 * Signs the payload using the current signing key associated with the controller identifier.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 OK and a {@link SignedPayload}.
 */
export function sign(request: Request): Response<any> {
    // Get the authentication details of the caller
    const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
    const controllerIdentifier = decodeURIComponent(request.params.id);

    // Check an identifier has been provided and
    // if not return 400 Bad Request
    if (!controllerIdentifier) {
        const identifierNotProvided = new IdentifierNotProvided(authenticatedIdentity);
        console.log(identifierNotProvided);
        return identifierNotProvided.toErrorResponse();
    }

    // Read the text from the request and validate
    // before we do any work retrieving keys.
    const payload = request.body.text();
    if (!payload || payload.length === 0) {
        const payloadNotProvided = new PayloadNotProvided(authenticatedIdentity);
        console.log(payloadNotProvided);
        return payloadNotProvided.toErrorResponse();
    }

    // Try read the identifier from the store
    const identifierKeys = new IdentifierStore().read(controllerIdentifier);
    if (!identifierKeys) {
        const identifierNotFound = new IdentifierNotFound(controllerIdentifier, authenticatedIdentity);
        console.log(identifierNotFound);
        return identifierNotFound.toErrorResponse();
    }

    // Get the current signing key and return error if
    // one is not returned.
    const currentKey = identifierKeys.getCurrentKey(KeyUse.Signing);
    if (!currentKey) {
        const keyNotConfigured = new KeyNotConfigured(authenticatedIdentity, controllerIdentifier);
        // Send to the console as an error since this is not
        // a client recoverable error.
        console.error(keyNotConfigured);
        return keyNotConfigured.toErrorResponse();
    }

    const signingAlgorithm: SigningAlgorithm = {
        name: <AlgorithmName>currentKey.algorithm.toString(),
        hash: 'SHA-256'
    };

    // Encode the payload, generate the signature and
    // then convert to a Base64URL encoded string
    const payloadBuffer = stringConverter.encode(payload);
    const signatureBuffer = createSignature(signingAlgorithm, currentKey.privateKey, payloadBuffer);
    const signature = Base64.fromUint8Array(new Uint8Array(signatureBuffer), true);

    return {
        statusCode: 200,
        body: <SignedPayload> {
            "signature": signature,
            "algorithm": signingAlgorithm,
            "keyIdentifier": currentKey.id
        }
    };
}