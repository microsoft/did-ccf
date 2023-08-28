// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedRequest } from '../../../dist/src/models/AuthenticatedRequest.js';
import { expect } from 'chai';

describe ('AuthenticatedRequest', () => {
    it ('should construct a new instance for `no_auth` policy.', () => {
        const request = {
            caller: {
                policy: "no_auth"
            }
        };

        const authenticatedRequest = new AuthenticatedRequest(request);
        expect(authenticatedRequest).not.null;
        expect(authenticatedRequest.authenticatedIdentity.policy).to.equal('no_auth');
        expect(authenticatedRequest.authenticatedIdentity.identifier).to.equal('Unauthenticated');
        expect(authenticatedRequest.body).to.be.undefined;
    });

    it ('should construct a new instance for `jwt` policy.', () => {
        const request = {
            caller: {
                policy: "jwt",
                jwt: {
                    keyIssuer: "issuer"
                }   
            }
        };

        const authenticatedRequest = new AuthenticatedRequest(request);
        expect(authenticatedRequest).not.null;
        expect(authenticatedRequest.authenticatedIdentity.policy).to.equal('jwt');
        expect(authenticatedRequest.authenticatedIdentity.identifier).to.equal('issuer');
        expect(authenticatedRequest.body).to.be.undefined;
    });

    it ('should construct a new instance for `user_cose_sign1` policy with empty body.', () => {
        const request = {
            caller: {
                policy: "user_cose_sign1",
                id: "user_cose_sign1_id",  
                cose: {
                    content: {}
                }
            }
        };

        const authenticatedRequest = new AuthenticatedRequest(request);
        expect(authenticatedRequest).not.null;
        expect(authenticatedRequest.authenticatedIdentity.policy).to.equal('user_cose_sign1');
        expect(authenticatedRequest.authenticatedIdentity.identifier).to.equal('user_cose_sign1_id');
        expect(authenticatedRequest.body).to.be.undefined;
    });
})
