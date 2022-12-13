import * as ccfapp from '@microsoft/ccf-app';
import MemberIdentifierKeys from '../../models/MemberIdentifierKeys';

/**
 * Resolves the specified decentralized identifier.
 * @param {ccfapp.Request} request containing the CCF request context.
 * @returns HTTP 200 Created and the {@link ControllerDocument} for the identifier.
 */
export function resolve (request: ccfapp.Request): ccfapp.Response<any> {
  const controllerIdentifier = request.params.id;

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

  return {
    statusCode: 200,
    body: memberIdentifierKeys.controllerDocument
  };
}
