// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
  Request,
  Response,
  string as stringConverter,
} from '@microsoft/ccf-app';
import { digest } from '@microsoft/ccf-app/crypto';
import { Base64 } from 'js-base64';
import {
  AuthenticatedIdentity,
  ControllerDocument,
  EcdsaCurve,
  Identifier,
  IdentifierStore,
  KeyAlgorithm,
  KeyPair,
  KeyPairCreator,
  RequestParser,
  RsaKeyPair,
  VerificationMethodRelationship,
  VerificationMethodType,
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
  const requestParser = new RequestParser(request);

  // Get the optional parameters from the request
  const onBehalfOf = requestParser.getQueryParameter<string>(RequestParameters.OnBehalfOf);
  const algorithm = requestParser.getQueryParameter<KeyAlgorithm>(RequestParameters.Algorithm, KeyAlgorithm.Eddsa);
  const size = requestParser.getQueryParameter<number>(RequestParameters.KeySize, RsaKeyPair.DEFAULT_KEY_SIZE);
  const curve = requestParser.getQueryParameter<EcdsaCurve>(RequestParameters.Curve, EcdsaCurve.Secp256r1);

  console.log(`Creating identifier for member '${authenticatedIdentity.identifier}' with algorithm '${algorithm}' and curve '${curve}'`);

  // Generate two key pairs per identifier, one for signing
  // and one for encryption
  const signingKeyPair: KeyPair = KeyPairCreator.createSigningKey(algorithm, size, curve);
  const encryptionKeyPair: KeyPair = KeyPairCreator.createEncryptionKey(algorithm, size, curve);

  // Use the digest of public signing key to use as the identifier
  const publicKeyDigestArray = digest('SHA-256', stringConverter.encode(signingKeyPair.publicKey));
  const publicKeyDigestBase64Url = Base64.fromUint8Array(new Uint8Array(publicKeyDigestArray), true).toString();

  // Create the identifier for the document based on the public key digest
  const identifierId = `did:ccf:${request.hostname}:${publicKeyDigestBase64Url}`;
  const controllerDocument = new ControllerDocument(identifierId);

  // Add the signing key
  controllerDocument.addVerificationMethod({
    id: signingKeyPair.id,
    controller: identifierId,
    type: VerificationMethodType.JsonWebKey2020,
    publicKeyJwk: signingKeyPair.asJwk(false),
  }, [VerificationMethodRelationship.Authentication]);

  // Add the encryption key
  controllerDocument.addVerificationMethod({
    id: encryptionKeyPair.id,
    controller: identifierId,
    type: VerificationMethodType.JsonWebKey2020,
    publicKeyJwk: encryptionKeyPair.asJwk(false),
  }, [VerificationMethodRelationship.KeyAgreement]);

  // Now store the keys in the key value store using the
  // digest as the identifier.
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
  new IdentifierStore().addOrUpdate(
    <Identifier> {
      id: publicKeyDigestBase64Url,
      controller: onBehalfOf || authenticatedIdentity.identifier,
      controllerDocument,
      keyPairs: [signingKeyPair, encryptionKeyPair],
      controllerDelegate: authenticatedIdentity.identifier,
    });

  console.log(`Identifier '${identifierId}' created for member '${authenticatedIdentity.identifier}'.`);

  // Return 201 and the controller document representing the newly created identifier.
  return {
    statusCode: 201,
    body: controllerDocument,
  };
}
