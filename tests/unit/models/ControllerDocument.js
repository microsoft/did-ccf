// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { ControllerDocument } from '../../../dist/src/models/ControllerDocument.js';
import { VerificationMethodType } from '../../../dist/src/models/VerificationMethodType.js';
import { VerificationMethodRelationship } from '../../../dist/src/models/VerificationMethodRelationship.js';

import { expect } from 'chai';

const EXPECTED_CONTEXT = '"@context":["https://www.w3.org/ns/did/v1","https://w3id.org/security/suites/jws-2020/v1",{"@vocab":"https://github.com/microsoft/did-ccf/blob/main/DID_CCF.md#"}]';

describe ('ControllerDocument', () => {
    it ('should serialize to JSON with @context', () =>{
        const controllerDocument = new ControllerDocument('test_identifier');
        const json = JSON.stringify(controllerDocument);
        expect(json).to.equal(`{"id":"test_identifier","verificationMethod":[],${EXPECTED_CONTEXT}}`);
    });

    describe ('addVerificationMethod', () => {
        it ('should add verification method and serialize to JSON', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const verificationMethod = {
                id: "method_identifier",
                controller: "test_identifier",
                type: VerificationMethodType.JsonWebKey2020,
                publicKeyJwk: {}
            };
            controllerDocument.addVerificationMethod(verificationMethod);
            const json = JSON.stringify(controllerDocument);
            expect(json).to.equal(`{"id":"test_identifier","verificationMethod":[{"id":"method_identifier","controller":"test_identifier","type":"JsonWebKey2020","publicKeyJwk":{}}],${EXPECTED_CONTEXT}}`);
        });

        it ('should add verification method plus relationship and serialize to JSON', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const verificationMethod = {
                id: "method_identifier",
                controller: "test_identifier",
                type: VerificationMethodType.JsonWebKey2020,
                publicKeyJwk: {}
            };
            controllerDocument.addVerificationMethod(verificationMethod, [VerificationMethodRelationship.Authentication ] )
            const json = JSON.stringify(controllerDocument);
            expect(json).to.equal(`{"id":"test_identifier","verificationMethod":[{"id":"method_identifier","controller":"test_identifier","type":"JsonWebKey2020","publicKeyJwk":{}}],${EXPECTED_CONTEXT},"authentication":["method_identifier"]}`);
        });

        it ('should add verification relationships when provided', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const verificationMethod = {
                id: "method_identifier",
                controller: "test_identifier",
                type: VerificationMethodType.JsonWebKey2020,
                publicKeyJwk: {}
            };
            
            controllerDocument.addVerificationMethod(verificationMethod, [
                VerificationMethodRelationship.Authentication, 
                VerificationMethodRelationship.AssertionMethod,
                VerificationMethodRelationship.KeyAgreement,
                VerificationMethodRelationship.CapabilityInvocation,
                VerificationMethodRelationship.CapabilityDelegation ] )
            
            expect(controllerDocument.hasOwnProperty('authentication')).to.be.true;
        });
    });

    describe ('addOrUpdateService', () => {
        it ('should add service and serialize to JSON', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const service = {
                id: "service_identifier",
                type: "service_type",
                serviceEndpoint: "https://example.com"
                
            };
            controllerDocument.addOrUpdateService(service);
            const json = JSON.stringify(controllerDocument);
            expect(json).to.equal(`{"id":"test_identifier","verificationMethod":[],${EXPECTED_CONTEXT},"service":[{"id":"service_identifier","type":"service_type","serviceEndpoint":"https://example.com"}]}`);
        });

        it ('should add service with service map and serialize to JSON', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const service = {
                id: "service_identifier",
                type: "service_type",
                serviceEndpoint: {
                    origins: [
                      "https://example.com"
                    ]
                  }
                
            };
            controllerDocument.addOrUpdateService(service);
            const json = JSON.stringify(controllerDocument);
            expect(json).to.equal(`{"id":"test_identifier","verificationMethod":[],${EXPECTED_CONTEXT},"service":[{"id":"service_identifier","type":"service_type","serviceEndpoint":{"origins":["https://example.com"]}}]}`);
        });

        it ('should add multiple services', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const firstService = {
                id: "first_service_identifier",
                type: "service_type",
                serviceEndpoint: "https://example.com"
                
            };
            
            // Add service
            controllerDocument.addOrUpdateService(firstService);
            expect(controllerDocument.service).to.not.be.empty;
            expect(controllerDocument.service.length).to.equal(1);
            expect(controllerDocument.service[0].id).to.equal('first_service_identifier');
            expect(controllerDocument.service[0].serviceEndpoint).to.equal('https://example.com');

            const secondService = {
                id: "second_service_identifier",
                type: "service_type",
                serviceEndpoint: "https://another.example.com"
                
            };

            // Update service
            controllerDocument.addOrUpdateService(secondService);
            expect(controllerDocument.service).to.not.be.empty;
            expect(controllerDocument.service.length).to.equal(2);
            expect(controllerDocument.service[1].id).to.equal('second_service_identifier');
            expect(controllerDocument.service[1].serviceEndpoint).to.equal('https://another.example.com');
            
        });

        it ('should update existing service', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const service = {
                id: "service_identifier",
                type: "service_type",
                serviceEndpoint: "https://example.com"
                
            };
            
            // Add service
            controllerDocument.addOrUpdateService(service);
            expect(controllerDocument.service).to.not.be.empty;
            expect(controllerDocument.service.length).to.equal(1);
            expect(controllerDocument.service[0].id).to.equal('service_identifier');
            expect(controllerDocument.service[0].serviceEndpoint).to.equal('https://example.com');

            const updatedService = {
                id: "service_identifier",
                type: "service_type",
                serviceEndpoint: "https://new.example.com"
                
            };

            // Update service
            controllerDocument.addOrUpdateService(updatedService);
            expect(controllerDocument.service).to.not.be.empty;
            expect(controllerDocument.service.length).to.equal(1);
            expect(controllerDocument.service[0].id).to.equal('service_identifier');
            expect(controllerDocument.service[0].serviceEndpoint).to.equal('https://new.example.com');
            
        });
    });

    describe ('removeService', () => {
        it ('should remove service', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const firstService = {
                id: "first_service_identifier",
                type: "service_type",
                serviceEndpoint: "https://example.com"
                
            };
            
            const secondService = {
                id: "second_service_identifier",
                type: "service_type",
                serviceEndpoint: "https://another.example.com"
            };

            // Remove services
            controllerDocument.addOrUpdateService(firstService);
            controllerDocument.addOrUpdateService(secondService);
            expect(controllerDocument.service).to.not.be.empty;
            expect(controllerDocument.service.length).to.equal(2);

            controllerDocument.removeService('first_service_identifier');
            expect(controllerDocument.service).to.not.be.empty;
            expect(controllerDocument.service.length).to.equal(1);
            expect(controllerDocument.service[0].id).to.equal('second_service_identifier');
            
        });

        it ('should not throw when removing a service that does not exist (idempotent)', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const firstService = {
                id: "first_service_identifier",
                type: "service_type",
                serviceEndpoint: "https://example.com"
                
            };

            // Remove service
            controllerDocument.addOrUpdateService(firstService);
            expect(controllerDocument.removeService('not_exist')).not.to.throw;
        });

        it ('should not throw when removing a service and controller document contains no services', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            expect(controllerDocument.removeService('not_exist')).not.to.throw;
        });
    });

    describe ('hasService', () => {
        it ('should return true when the controller document contains the specified service', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const firstService = {
                id: "first_service_identifier",
                type: "service_type",
                serviceEndpoint: "https://example.com"
            };

            // Remove services
            controllerDocument.addOrUpdateService(firstService);
            expect(controllerDocument.hasService('first_service_identifier')).to.be.true;
        });

        it ('should return false when the controller document contains the specified service', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            const firstService = {
                id: "first_service_identifier",
                type: "service_type",
                serviceEndpoint: "https://example.com"
            };

            // Remove services
            controllerDocument.addOrUpdateService(firstService);
            expect(controllerDocument.hasService('not_exist_service_identifier')).to.be.false;
        });

        it ('should return false when the controller document does not contain any services', () =>{
            const controllerDocument = new ControllerDocument('test_identifier');
            expect(controllerDocument.hasService('not_exist_service_identifier')).to.be.false;
        });
    });
});
