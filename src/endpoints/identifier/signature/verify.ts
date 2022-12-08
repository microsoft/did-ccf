import * as ccfapp from '@microsoft/ccf-app';
import * as crypto from '@microsoft/ccf-app/crypto';
import { Base64 } from 'js-base64';
import { AlgorithmName, ccf } from '@microsoft/ccf-app/global';
import { KeyState } from '../../../models/KeyState';
import MemberIdentifierKeys from '../../../models/MemberIdentifierKeys';

export function verify(request: ccfapp.Request): ccfapp.Response<any> {
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

    // Get the signature and payload from
    // the body JSON and validate before we do any
    // real work.
    const bodyJson = request.body.json();
    const signatureBase64 = bodyJson?.signature;
    const payload = bodyJson?.payload;
    if (!signatureBase64 || signatureBase64.length === 0) {
        return {
            statusCode: 400,
            body: {
                error: `The request does not include a signature to verify. Both a signature and payload are required.`,
            },
        };
    }
    
    if (!payload || payload.length === 0) {
        return {
            statusCode: 400,
            body: {
                error: `The request does not include a payload to verify. Both a signature and payload are required.`,
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

    // Attempt to get the current signing key for the identifier, returning
    // and error if no signing key with a state marked as current is present in the members
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

    // Encode the payload, convert the base64URL encoded
    // signature to an array and verify signature
    const signature = Base64.toUint8Array(signatureBase64);
    const isSignatureValid = crypto.verifySignature(
        signingAlgorithm, 
        currentKey.publicKey, 
        signature.buffer, 
        ccfapp.string.encode(payload));

    return {
        statusCode: 200,
        body: isSignatureValid
    };
}