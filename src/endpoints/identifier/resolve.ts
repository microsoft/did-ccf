import * as ccfapp from '@microsoft/ccf-app';
import MemberIdentifierKeys from '../../models/MemberIdentifierKeys';

export function resolve (request: ccfapp.Request): ccfapp.Response<any> {
  const did = request.params.id;

  // Check an identifier has been provided and
  // if no return 400 Bad Request
  if (!did) {
    return {
      statusCode: 400,
      body: {
        error: 'An identifier must be specified',
      },
    };
  }

  // Try read the identifier from the store
  const identifierStore = ccfapp.typedKv('member_identifier_store', ccfapp.string, ccfapp.json<MemberIdentifierKeys>());
  const memberIdentifierKeys: MemberIdentifierKeys =  <MemberIdentifierKeys>identifierStore.get(did);

  if (!memberIdentifierKeys) {
    return {
      statusCode: 404,
      body: {
        error: 'Specified identifier not found on the network.',
      },
    };
  }

  return {
    body: memberIdentifierKeys.controllerDocument
  };
}
