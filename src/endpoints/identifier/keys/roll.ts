import * as ccfapp from '@microsoft/ccf-app';
import { MemberSignatureAuthnIdentity } from '@microsoft/ccf-app';
import MemberIdentifierKeys from '../../../models/MemberIdentifierKeys';
import { KeyPair } from '../../../models/KeyPair';
import { KeyState } from '../../../models/KeyState';
import { VerificationMethodRelationship } from '../../../models/VerificationMethodRelationship';
import { VerificationMethodType } from '../../../models/VerificationMethodType';
import ControllerDocument from '../../../models/ControllerDocument';
import { QueryStringParser } from '../../../models/QueryStringParser';
import { KeyAlgorithm } from '../../../models/KeyAlgorithm';
import { EcdsaCurve } from '../../../models/EcdsaCurve';
import { EddsaCurve } from '../../../models/EddsaCurve';
import { KeyPairCreator } from '../../../models/KeyPairCreator';

/**
 * Rolls the current key pair associated with the controller
 * identifier using the existing key algorihtm as the
 * algorithm.
 * @param {ccfapp.Request} request passed to the API.
 */
export function roll(request: ccfapp.Request): ccfapp.Response {
  // Decentralized Identifiers (DIDs) are created in the scope
  // of a network member. Only the member associated with the
  // identifier can initiate a key roll.
  const memberId = <MemberSignatureAuthnIdentity>request.caller;

  const controllerIdentifier: string = request.params.id;

  // Check an identifier has been provided and
  // if not return 400 Bad Request
  if (!controllerIdentifier) {
    return {
      statusCode: 400,
      body: {
        error: 'A controller identifier must be specified.',
      },
    };
  }

  // Try read the identifier from the store
  const identifierStore = ccfapp.typedKv('member_identifier_store', ccfapp.string, ccfapp.json<MemberIdentifierKeys>());
  const memberIdentifierKeys: MemberIdentifierKeys = <MemberIdentifierKeys>identifierStore.get(controllerIdentifier);

  if (!memberIdentifierKeys) {
    return {
      statusCode: 404,
      body: {
        error: `Specified identifier '${controllerIdentifier}' not found on the network.`,
      },
    };
  }

  // Check that the member is the owner of the
  // identifier.
  if (memberIdentifierKeys.memberId !== memberId.id) {
    return {
      statusCode: 400,
      body: {
        error: `Specified identifier '${controllerIdentifier}' is not owned by the consortium member with ID '${memberId}'.`,
      },
    };
  }

  // Get the current key from the members keys then
  // 1. Get the current key, check if the same key type is being generated as part of the roll.
  // 2. Generate the new key.
  // 1. Update the current key state to historical. 
  // 2. Remove the current key's private key.
  const currentKey = memberIdentifierKeys.keyPairs.find(key => key.state === KeyState.Current);

  // We have macthed an identifier, so let's parse the
  // query string to see if any alg and curve params
  // have been specified. If not just use the properties
  // of the existing key.
  const queryParams = new QueryStringParser(request.query);
  const algorithm: KeyAlgorithm = <KeyAlgorithm>queryParams['alg'] || currentKey.algorithm;
  const size: number = Number.parseInt(queryParams['size']) || currentKey.size;
  const curve: EcdsaCurve | EddsaCurve = <EcdsaCurve>queryParams['curve'] || currentKey?.curve;

  // Now generate the new key
  const newKey: KeyPair = KeyPairCreator.createKey(algorithm, size, curve);

  // Update the current key state and delete private key
  currentKey.state = KeyState.Historical;
  delete currentKey.privateKey;

  // Now add the new keys to the member
  memberIdentifierKeys.keyPairs.push(newKey);

  // Add the new verification method to the controller document
  // and then update the store
  const controllerDocument = Object.setPrototypeOf(memberIdentifierKeys.controllerDocument, ControllerDocument.prototype);
  controllerDocument.addVerificationMethod({
    id: newKey.id,
    controller: memberIdentifierKeys.controllerDocument.id,
    type: VerificationMethodType.JsonWebKey2020,
    publicKeyJwk: newKey.asJwk(false),
  }, [VerificationMethodRelationship.Authentication]);

  // Store the new identifier
  identifierStore.set(controllerIdentifier, memberIdentifierKeys);

  // Return 201 and the controller document representing the updated controller document.
  return {
    statusCode: 201,
    body: memberIdentifierKeys.controllerDocument,
  };
}
