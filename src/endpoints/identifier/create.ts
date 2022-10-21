import * as ccfapp from '@microsoft/ccf-app';
import * as crypto from '@microsoft/ccf-app/crypto';
import { Base64 } from 'js-base64';
import ControllerDocument from '../../models/ControllerDocument';
import MemberIdentifierKeys from '../../models/MemberIdentifierKeys';
import { KeyPair } from '../../models/KeyPair';
import { VerificationMethodRelationship } from '../../models/VerificationMethodRelationship';
import { VerificationMethodType } from '../../models/VerificationMethodType';
import { MemberSignatureAuthnIdentity } from '@microsoft/ccf-app';
import { KeyAlgorithm } from '../../models/KeyAlgorithm';
import { EcdsaCurve } from '../../models/EcdsaCurve';
import { QueryStringParser } from '../../models/QueryStringParser';

/**
 * Creates a new decentralized identifier
 * @param request
 * @returns
 */
export function create (request: ccfapp.Request): ccfapp.Response {
  // Decentralized Identifiers (DIDs) are created in the scope
  // of a network member. Members are not limited in the number
  // of identifiers they can create.
  const memberId = <MemberSignatureAuthnIdentity>request.caller;
  const queryParams = new QueryStringParser(request.query);

  // Get the optional parameters from the request
  const algorithm: KeyAlgorithm = <KeyAlgorithm>queryParams['alg'] || KeyAlgorithm.Ecdsa;
  const curve: EcdsaCurve = <EcdsaCurve>queryParams['curve'] || EcdsaCurve.Secp256r1;

  // Generate a new key pair
  const keyPair: KeyPair = algorithm === KeyAlgorithm.Rsa ? KeyPair.newRsaKeyPair() : KeyPair.newEcdsaKeyPair(curve);

  // Get the digest of the public key to use as the identifier
  const publicKeyDigestArray = crypto.digest('SHA-256', ccfapp.string.encode(keyPair.publicKey));
  const publicKeyDigestBase64Url = Base64.fromUint8Array(new Uint8Array(publicKeyDigestArray), true).toString();

  // Now store the keys in the key value store using the
  // digest as the identifier
  const identifierStore = ccfapp.typedKv('member_identifier_store', ccfapp.string, ccfapp.json<MemberIdentifierKeys>());

  // Create the identifier for the document based on the public key digest
  const identifier = `did:ccf:${request.hostname}:${publicKeyDigestBase64Url}`;

  const controllerDocument = new ControllerDocument(identifier);
  controllerDocument.addVerificationMethod({
    id: keyPair.id,
    controller: identifier,
    type: VerificationMethodType.JsonWebKey2020,
    publicKeyJwk: keyPair.publicKey,
  }, [VerificationMethodRelationship.Authentication]);

  // Store the new identifier
  identifierStore.set(publicKeyDigestBase64Url, {memberId: memberId.id,  controllerDocument: controllerDocument, keyPairs: [ keyPair ]});

  // Return 201 and the controller document representing the newly created identifier.
  return {
    statusCode: 201,
    body: controllerDocument
  };
}
