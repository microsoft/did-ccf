import * as ccfapp from '@microsoft/ccf-app';
import { KeyPair } from '../../../all';
import MemberIdentifierKeys from '../../../models/MemberIdentifierKeys';

/**
 * Lists the keys associated with the controller
 * identifier.
 * @param {ccfapp.Request} request passed to the API.
 */
export function list (request: ccfapp.Request): ccfapp.Response {
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

  // Remove the private keys from the collection before
  // returning id, public key and state
  // DEBUG why this map returns all props
  //const keys = memberIdentifierKeys.keyPairs.map<KeyPair>(keyPair => { return {id: keyPair.id, state: keyPair.state, publicKey: keyPair.publicKey } = keyPair });
  const keys = memberIdentifierKeys.keyPairs.map<any>(keyPair => { 
      const key = {};
      key['id'] = keyPair.id;
      key['state'] = keyPair.state;
      key['publicKey'] = keyPair.publicKey;

      return key;
  });

  return {
    statusCode: 200,
    body: {
        keys: keys
    }
  }
}
