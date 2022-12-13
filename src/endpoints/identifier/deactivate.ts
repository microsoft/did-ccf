import * as ccfapp from '@microsoft/ccf-app';
import MemberIdentifierKeys from '../../models/MemberIdentifierKeys';

/**
 * Deactivates the specified decentralized identifier.
 * @param {ccfapp.Request} request containing the CCF request context.
 * @returns HTTP 200 OK on successful deactivation of the decentralized identifier.
 */
export function deactivate (request: ccfapp.Request): ccfapp.Response<any> {
    // Decentralized Identifiers (DIDs) are created in the scope
    // of a network member. Members are not limited in the number
    // of identifiers they can create.
    const memberId = <ccfapp.MemberSignatureAuthnIdentity>request.caller;
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

    // Delete the controller identifier from the store. This removes
    // the controller document and all associated keys from the store.
    identifierStore.delete(controllerIdentifier);

    return {
        statusCode: 200
    };
}
