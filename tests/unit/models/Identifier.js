// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { ControllerDocument } from '../../../dist/src/models/ControllerDocument.js';
import { Identifier } from '../../../dist/src/models/Identifier.js';
import { KeyUse } from '../../../dist/src/models/KeyUse.js';
import { expect } from 'chai';

describe ('Identifier', () => {
    it ('should construct a new instance', () => {
        const identifier = new Identifier(
            'identifier_id',
            'controller_id',
            new ControllerDocument('identifier_id'),
            [{
                id: "sig_key_id",
                state: "current",
                use: "sig"
            }, 
            {
                id: "enc_key_id",
                state: "current",
                use: "enc"
            }]);
        
        expect(identifier).not.null;
        expect(identifier.id).to.equal('identifier_id');
        expect(identifier.controller).to.equal('controller_id');
        expect(identifier.controllerDocument).to.exist;
        expect(identifier.controllerDocument.id).to.equal('identifier_id');
        expect(identifier.keyPairs.length).to.equal(2);
    });

    describe ('isController', () => {
        it ('should return false when the specified identity is not the controller of the identifier', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'));
            
            expect(identifier.isController({ identifier: "not_the_controller"})).to.false;
        });

        it ('should return true when the specified identity is the controller of the identifier', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'));
                        
            expect(identifier.isController({ identifier: "controller_id"})).to.true;
        });

        it ('should return false when the specified identity is not the delegated controller of the identifier', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [],
                'delegate_identifier');
            
            expect(identifier.isController({ identifier: "not_the_controller"})).to.false;
        });

        it ('should return true when the specified identity is the delegated controller of the identifier', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [],
                'delegate_identifier');
                        
            expect(identifier.isController({ identifier: "delegate_identifier"})).to.true;
        });
    });

    describe ('getCurrentKey', () => {
        it ('should return the current signing key when key use not specified', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [ {
                    id: "sig_key_id",
                    state: "current",
                    use: "sig"
                }, 
                {
                    id: "enc_key_id",
                    state: "current",
                    use: "enc"
                }]
            );
            
            const result = identifier.getCurrentKey();
            expect(result).to.exist;
            expect(result.id).to.equal('sig_key_id');
            expect(result.state).to.equal('current');
            expect(result.use).to.equal(KeyUse.Signing);
        });

        it ('should return the current signing key when key use specified', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [ {
                    id: "sig_key_id",
                    state: "current",
                    use: "sig"
                }, 
                {
                    id: "enc_key_id",
                    state: "current",
                    use: "enc"
                }]
            );
            
            const result = identifier.getCurrentKey(KeyUse.Signing);
            expect(result).to.exist;
            expect(result.id).to.equal('sig_key_id');
            expect(result.state).to.equal('current');
            expect(result.use).to.equal(KeyUse.Signing);
        });

        it ('should return the current encryption key', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [ {
                    id: "sig_key_id",
                    state: "current",
                    use: "sig"
                }, 
                {
                    id: "enc_key_id",
                    state: "current",
                    use: "enc"
                }]
            );
            
            const result = identifier.getCurrentKey(KeyUse.Encryption);
            expect(result).to.exist;
            expect(result.id).to.equal('enc_key_id');
            expect(result.state).to.equal('current');
            expect(result.use).to.equal(KeyUse.Encryption);
        });

        it ('should not throw when no current signing key', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [ {
                    id: "enc_key_id",
                    state: "current",
                    use: "enc"
                }]
            );
            
            expect(identifier.getCurrentKey()).to.not.throw;
        });

        it ('should not throw when no current encryption key', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [ {
                    id: "sig_key_id",
                    state: "current",
                    use: "sig"
                }]
            );
            
            expect(identifier.getCurrentKey(KeyUse.Encryption)).to.not.throw;
        });
    });

    describe ('getKeyById', () => {
        it ('should return the specified key', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [ {
                    id: "sig_key_id",
                    state: "current",
                    use: "sig"
                },
                {
                    id: "hist_key_id",
                    state: "historical",
                    use: "sig"
                }, 
                {
                    id: "enc_key_id",
                    state: "current",
                    use: "enc"
                }]
            );
            
            const result = identifier.getKeyById('hist_key_id');
            expect(result).to.exist;
            expect(result.id).to.equal('hist_key_id');
            expect(result.state).to.equal('historical');
            expect(result.use).to.equal(KeyUse.Signing);
        });

        it ('should not throw when key does not exist', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id'),
                [ {
                    id: "sig_key_id",
                    state: "current",
                    use: "sig"
                }]
            );
            
            expect(identifier.getKeyById('not_exists')).to.not.throw;
        });

        it ('should not throw when the identifier has no keys', () => {
            const identifier = new Identifier(
                'identifier_id',
                'controller_id',
                new ControllerDocument('identifier_id')
            );
            
            expect(identifier.getKeyById('not_exists')).to.not.throw;
        });
    });
})
