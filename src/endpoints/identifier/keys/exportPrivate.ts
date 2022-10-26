import * as ccfapp from '@microsoft/ccf-app';
import MemberIdentifierKeys from '../../../models/MemberIdentifierKeys';

/**
 * Exports the specified key associated with the controller
 * identifier including the private key.
 * @param {ccfapp.Request} request passed to the API.
 */
export function exportPrivate (request: ccfapp.Request): ccfapp.Response {
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

  // Get matchedKey
  const matchedKey = memberIdentifierKeys.keyPairs.find(key => key.id === keyIdentifier);

  if (!matchedKey) {
    return {
      statusCode: 404,
      body: {
        error: `Specified key '${keyIdentifier}' not found in member '${controllerIdentifier}' key store.`,
      },
    };
  }

  return {
    statusCode: 200,
    body: matchedKey
  }
}
