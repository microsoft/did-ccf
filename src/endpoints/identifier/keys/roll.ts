import * as ccfapp from '@microsoft/ccf-app';
import MemberIdentifierKeys from '../../../models/MemberIdentifierKeys';
import { KeyPair, KeyState } from '../../../models/KeyPair';
import { VerificationMethodRelationships } from '../../../models/VerificationMethodRelationships';
import { VerificationMethodType } from '../../../models/VerificationMethodType';
import ControllerDocument from '../../../models/ControllerDocument';
import { MemberSignatureAuthnIdentity } from '@microsoft/ccf-app';

/**
 * Rolls the current key pair associated with the controller
 * identifier.
 * @param {ccfapp.Request} request passed to the API.
 */
export function roll (request: ccfapp.Request): ccfapp.Response {
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
  const memberIdentifierKeys: MemberIdentifierKeys =  <MemberIdentifierKeys>identifierStore.get(controllerIdentifier);

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

  // Create a new key for the controller
  const newKeys = KeyPair.newRsaKeyPair();

  // Get the current key from the members keys then
  // 1. Update the state to historical. 
  // 2. Remove the private key
  const currentKeys = memberIdentifierKeys.keyPairs.find(keys => keys.state === KeyState.current);
  currentKeys.state = KeyState.historical;
  delete currentKeys.privateKey;

  // Now add the new keys to the member
  memberIdentifierKeys.keyPairs.push(newKeys);

  // Add the new verification method to the controller document
  // and then update the store
  const controllerDocument = Object.setPrototypeOf(memberIdentifierKeys.controllerDocument, ControllerDocument.prototype);
  controllerDocument.addVerificationMethod({
      id: newKeys.id,
      controller: memberIdentifierKeys.controllerDocument.id,
      type: VerificationMethodType.JsonWebKey2020,
      publicKeyJwk: newKeys.publicKey,
    }, [VerificationMethodRelationships.authentication]);
  
  // Store the new identifier
  identifierStore.set(controllerIdentifier, memberIdentifierKeys);
  
  // Return 201 and the controller document representing the updated controller document.
  return {
    statusCode: 201,
    body: memberIdentifierKeys.controllerDocument,
  };
}
