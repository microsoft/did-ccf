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
import { KeyPairCreator } from '../../models/KeyPairCreator';

/**
 * Creates a new decentralized identifier in the scope of the member.
 * @param {ccfapp.Request} request containing the CCF request context.
 * @returns HTTP 201 Created and the {@link ControllerDocument} for the newly created identifier.
 */
export function create (request: ccfapp.Request): ccfapp.Response {
  // Decentralized Identifiers (DIDs) are created in the scope
  // of a network member. Members are not limited in the number
  // of identifiers they can create.
  const memberId = <MemberSignatureAuthnIdentity>request.caller;
  const queryParams = new QueryStringParser(request.query);

  // Get the optional parameters from the request
  const algorithm: KeyAlgorithm = <KeyAlgorithm>queryParams['alg'] || KeyAlgorithm.Eddsa;
  const size: number = Number.parseInt(queryParams['size'] || '4096');
  const curve: EcdsaCurve = <EcdsaCurve>queryParams['curve'] || EcdsaCurve.Secp256r1;

  console.log(`Creating identifier for member '${memberId}' with algorithm '${algorithm}' and curve '${curve}'`);

  // Generate a new key pair
  const keyPair: KeyPair = KeyPairCreator.createKey(algorithm, size, curve);

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
    publicKeyJwk: keyPair.asJwk(false),
  }, [VerificationMethodRelationship.Authentication]);

  // Store the new identifier
  identifierStore.set(publicKeyDigestBase64Url, {memberId: memberId.id,  controllerDocument: controllerDocument, keyPairs: [ keyPair ]});

  console.log(`Identifier '${identifier}' created for member '${memberId}'.`);

  // Return 201 and the controller document representing the newly created identifier.
  return {
    statusCode: 201,
    body: controllerDocument
  };
}
