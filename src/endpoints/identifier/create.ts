import * as ccfapp from '@microsoft/ccf-app';
import * as crypto from '@microsoft/ccf-app/crypto';
import { Base64 } from 'js-base64';
import ControllerDocument from '../../models/ControllerDocument';
import MemberIdentifierKeys from '../../models/MemberIdentifierKeys';
import { KeyPair } from '../../models/MemberIdentifierKeys';
import { VerificationMethodRelationships } from '../../models/VerificationMethodRelationships';
import { VerificationMethodType } from '../../models/VerificationMethodType';

/**
 * Creates a new decentralized identifier
 * @param request
 * @returns
 */
export function create (request: ccfapp.Request): ccfapp.Response {
  // Generate a new RSA key pair
  const { publicKey, privateKey } = crypto.generateRsaKeyPair(4096);
  const keyPair: KeyPair = new KeyPair(publicKey, privateKey);

  // Get the digest of the public key to use as the identifier
  const publicKeyDigestArray = crypto.digest('SHA-256', ccfapp.string.encode(publicKey));
  const publicKeyDigestBase64Url = Base64.fromUint8Array(new Uint8Array(publicKeyDigestArray), true).toString();

  // Now store the keys in the key value store using the
  // digest as the identifier
  const identifierStore = ccfapp.typedKv('member_identifier_store', ccfapp.string, ccfapp.json<MemberIdentifierKeys>());

  // Create the identifier for the document based on the public key digest
  const identifier = `did:ccf:exp-did-ccf:${publicKeyDigestBase64Url}`;

  const controllerDocument = new ControllerDocument(identifier);
  controllerDocument.addVerificationMethod({
    id: keyPair.id,
    controller: identifier,
    type: VerificationMethodType.JsonWebKey2020,
    publicKeyJwk: publicKey,
  }, [VerificationMethodRelationships.authentication]);

  // Store the new identifier
  identifierStore.set(publicKeyDigestBase64Url, { controllerDocument: controllerDocument, keyPairs: [ keyPair ]});

  // Return 201 and the controller document representing the newly created identifier.
  return {
    statusCode: 201,
    body: controllerDocument,
  };
}
