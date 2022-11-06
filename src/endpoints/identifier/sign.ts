import * as ccfapp from '@microsoft/ccf-app';
import * as crypto from '@microsoft/ccf-app/crypto';
import { AlgorithmName, ccf } from '@microsoft/ccf-app/global';
import { KeyState } from '../../models/KeyState';
import MemberIdentifierKeys from '../../models/MemberIdentifierKeys';

export function sign(request: ccfapp.Request): ccfapp.Response<any> {
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
    const memberIdentifierKeys: MemberIdentifierKeys = <MemberIdentifierKeys>identifierStore.get(controllerIdentifier);

    if (!memberIdentifierKeys) {
        return {
            statusCode: 404,
            body: {
                error: `Specified identifier '${controllerIdentifier}' not found on the network.`,
            },
        };
    }

    // Attempt to get the current signign key for the identifier, returning
    // and error if not signing key (state marked as current) is present in the members
    // key list.
    const currentKey = memberIdentifierKeys.keyPairs.find(key => key.state === KeyState.Current);

    if (!currentKey) {
        return {
            statusCode: 500,
            body: {
                error: `Specified identifier '${controllerIdentifier}' does not have a signing key.`,
            },
        };
    }

    const signingAlgorithm: crypto.SigningAlgorithm = {
        name: <AlgorithmName>currentKey.algorithm.toString(),
        hash: 'SHA-256'
    };

    // Read the text from the request and check that is
    // as expected.
    const textToSign = request.body.text();
    if (!textToSign || textToSign.length === 0) {
        return {
            statusCode: 400,
            body: {
                error: `The request does not include any text to sign.`,
            },
        };
    }

    const signature = crypto.sign(signingAlgorithm, currentKey.privateKey, ccfapp.string.encode(textToSign));

    return {
        statusCode: 200,
        body: {
            signature
        }
    };
}


