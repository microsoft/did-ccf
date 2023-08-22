// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from '../../../dist/src/models/AuthenticatedIdentity.js';
import { expect } from 'chai';

describe ('AuthenticatedIdentity', () => {
    it ('should construct a default instance.', () => {
        const authnIdentity = {
            policy: "no_auth"
        };

        const authenticatedIdentity = new AuthenticatedIdentity();
        expect(authenticatedIdentity).not.null;
        expect(authenticatedIdentity.policy).to.equal('no_auth');
        expect(authenticatedIdentity.identifier).to.equal('Unauthenticated');
    });

    it ('should construct a new instance for `no_auth` policy.', () => {
        const authnIdentity = {
            policy: "no_auth"
        };

        const authenticatedIdentity = new AuthenticatedIdentity(authnIdentity);
        expect(authenticatedIdentity).not.null;
        expect(authenticatedIdentity.policy).to.equal('no_auth');
        expect(authenticatedIdentity.identifier).to.equal('Unauthenticated');
    });

    it ('should construct a new instance for `jwt` policy.', () => {
        const authnIdentity = {
            policy: "jwt",
            jwt: {
                keyIssuer: "issuer"
            }    
        };

        const authenticatedIdentity = new AuthenticatedIdentity(authnIdentity);
        expect(authenticatedIdentity).not.null;
        expect(authenticatedIdentity.policy).to.equal('jwt');
        expect(authenticatedIdentity.identifier).to.equal('issuer');
    });

    it ('should construct a new instance for `user_cose_sign1` policy with empty body.', () => {
        const authnIdentity = {
            policy: "user_cose_sign1",
            id: "user_cose_sign1_id",  
            cose: {
                content: {}
            }
        };

        const authenticatedIdentity = new AuthenticatedIdentity(authnIdentity);
        expect(authenticatedIdentity).not.null;
        expect(authenticatedIdentity.policy).to.equal('user_cose_sign1');
        expect(authenticatedIdentity.identifier).to.equal('user_cose_sign1_id');
    });

    
    it ('should construct a new instance for `user_cose_sign1` policy with cose body.', () => {
        const coseString = "Cose";
        const coseBuffer = Uint8Array.from(coseString.split('').map(letter => letter.charCodeAt(0)));

        const authnIdentity = {
            policy: "user_cose_sign1",
            id: "user_cose_sign1_id",  
            cose: {
                content: coseBuffer.buffer
            }
        };

        const authenticatedIdentity = new AuthenticatedIdentity(authnIdentity);
        expect(authenticatedIdentity).not.null;
        expect(authenticatedIdentity.policy).to.equal('user_cose_sign1');
        expect(authenticatedIdentity.identifier).to.equal('user_cose_sign1_id');
        expect(authenticatedIdentity.coseBody).to.equal(coseString);
    });
})
