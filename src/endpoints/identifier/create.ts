// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
  Request,
  Response,
  string as stringConverter,
} from '@microsoft/ccf-app';
import { digest } from '@microsoft/ccf-app/crypto';
import { Base64 } from 'js-base64';
import { DomainNotFound } from '../../errors';
import {
  AuthenticatedIdentity,
  ControllerDocument,
  Domain,
  EcdsaCurve,
  IdentifierCreator,
  IdentifierStore,
  KeyAlgorithm,
  KeyPair,
  KeyPairCreator,
  RequestContext,
  RsaKeyPair,
} from '../../models';
import { RequestParameters } from '../../models/RequestParameters';

/**
 * Creates a new decentralized identifier in the scope of the user/member.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 201 Created and the {@link ControllerDocument} for the newly created identifier.
 */
export function create (request: Request): Response {
  // Get the authentication details of the caller
  const authenticatedIdentity = new AuthenticatedIdentity(request.caller);
  const context = new RequestContext(request);

  // Get the optional parameters from the request
  const onBehalfOf = context.getQueryParameter<string>(RequestParameters.OnBehalfOf);
  const algorithm = context.getQueryParameter<KeyAlgorithm>(RequestParameters.Algorithm, KeyAlgorithm.Eddsa);
  const size = context.getQueryParameter<number>(RequestParameters.KeySize, RsaKeyPair.DEFAULT_KEY_SIZE);
  const curve = context.getQueryParameter<EcdsaCurve>(RequestParameters.Curve, EcdsaCurve.Secp256r1);
  const prefix = context.getQueryParameter<string>(RequestParameters.Domain, request.hostname);
  context.logger.info(
    `Creating identifier for member '${authenticatedIdentity.identifier}' with algorithm '${algorithm}' and curve '${curve}' in '${prefix}'`);

  // Generate two key pairs per identifier, one for signing
  // and one for encryption
  const signingKeyPair: KeyPair = KeyPairCreator.createSigningKey(algorithm, size, curve);
  const encryptionKeyPair: KeyPair = KeyPairCreator.createEncryptionKey(algorithm, size, curve);

  // Use the digest of public signing key to use as the identifier
  const publicKeyDigestArray = digest('SHA-256', stringConverter.encode(signingKeyPair.publicKey));
  const publicKeyDigestBase64Url = Base64.fromUint8Array(new Uint8Array(publicKeyDigestArray), true).toString();

  // Create the identifier for the document based on the public key digest
  //
  // If the request is on behalf of a user/member (which is
  // determined by presence of the onBehalfOf parameter
  // provided in the request), set the `controller` as the
  // identifier provided in the onBehalfOf parameter and
  // the `controllerDelegate` as the authenticated identity
  // identifier making the request. If the request is not
  // an on behalf of request, set both the `controller`
  // and `controllerDelegate`to the authenticated identity
  // identifier.
  const controller = onBehalfOf || authenticatedIdentity.identifier;
  const identifier = IdentifierCreator.createIdentifier(
    signingKeyPair,
    encryptionKeyPair,
    [prefix, publicKeyDigestBase64Url],
    controller,
    authenticatedIdentity.identifier);

  // Map to the domain, if one is indicated
  const domain = new Domain(prefix);
  if (domain.isRegistered || prefix === request.hostname) {
    domain.add(identifier);
  } else if (prefix !== request.hostname) {
    // If we get here, then the caller has specified a domain which has not been
    // adopted by the members of the consortium and is also not the hostname of
    // the current node, so reject the request
    return new DomainNotFound(prefix, authenticatedIdentity).toErrorResponse();
  }

  // Now store the keys in the key value store using the
  // digest as the identifier.
  new IdentifierStore().addOrUpdate(identifier);
  context.logger.info(`Identifier '${identifier.id}' created for '${controller}'.`);

  // Return 201 and the controller document representing the newly created identifier.
  return {
    statusCode: 201,
    body: identifier.controllerDocument,
  };
}
