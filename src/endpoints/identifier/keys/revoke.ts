import * as ccfapp from '@microsoft/ccf-app';
import { KeyState } from '../../../models/KeyState';
import MemberIdentifierKeys from '../../../models/MemberIdentifierKeys';
import { VerificationMethodRelationship } from '../../../models/VerificationMethodRelationship';

/**
 * Revokes the specified key pair associated with the controller
 * identifier.
 * @param {ccfapp.Request} request passed to the API.
 */
export function revoke (request: ccfapp.Request): ccfapp.Response {
  const controllerIdentifier: string = request.params.id;
  const keyIdentifier: string = request.params.kid;
  
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

  // Get the current key from the members keys then
  // 1. Update the state to revoked
  // 2. Remove the private key
  // 3. Remove key entry from controller document
  const matchedKey = memberIdentifierKeys.keyPairs.find(key => key.id === keyIdentifier);

  if (!matchedKey) {
    return {
      statusCode: 404,
      body: {
        error: `Specified key with id '${keyIdentifier}' not found for identifier '${controllerIdentifier}'.`,
      },
    };
  }

  matchedKey.state = KeyState.Revoked;
  delete matchedKey.privateKey;

  // Remove the method from the verification methods array
  memberIdentifierKeys.controllerDocument.verificationMethods = memberIdentifierKeys.controllerDocument.verificationMethods.filter(verificationMethod => verificationMethod.id !== keyIdentifier);

  // Now remove from any references from relationships. Use the 
  // enum values since the document relationships begin lower case.
  Object.values(VerificationMethodRelationship).forEach(relationship => {
    if (memberIdentifierKeys.controllerDocument.hasOwnProperty(relationship)){
      memberIdentifierKeys.controllerDocument[relationship] = memberIdentifierKeys.controllerDocument[relationship].filter(reference => reference !== keyIdentifier);
    }
  });
  
  // Store the updated controller document and identifier keys
  identifierStore.set(controllerIdentifier, memberIdentifierKeys);
  
  // Return 201 and the controller document representing the updated controller document.
  return {
    statusCode: 200,
    body: memberIdentifierKeys.controllerDocument
  };
}
