import ControllerDocument from '../../../dist/src/models/ControllerDocument.js';
import { VerificationMethodType } from '../../../dist/src/models/VerificationMethodType.js';
import { VerificationMethodRelationship } from '../../../dist/src/models/VerificationMethodRelationship.js';

import { expect } from 'chai';

describe ('ControllerDocument', () => {
    it ('should serialize to JSON with @context', () =>{
        const controllerDocument = new ControllerDocument('test_identifier');
        const json = JSON.stringify(controllerDocument);
        expect(json).to.equal('{"id":"test_identifier","verificationMethods":[],"@context":["https://www.w3.org/ns/did/v1",{"@base":"test_identifier"}]}');
    });

    it ('should serialize to JSON verification method populated', () =>{
        const controllerDocument = new ControllerDocument('test_identifier');
        const verificationMethod = {
            id: 'method_identifier',
            controller: 'test_identifier',
            type: VerificationMethodType.JsonWebKey2020,
            publicKeyJwk: {}
        };
        controllerDocument.addVerificationMethod(verificationMethod);
        const json = JSON.stringify(controllerDocument);
        expect(json).to.equal('{"id":"test_identifier","verificationMethods":[{"id":"method_identifier","controller":"test_identifier","type":"JsonWebKey2020","publicKeyJwk":{}}],"@context":["https://www.w3.org/ns/did/v1",{"@base":"test_identifier"}]}');
    });

    it ('should serialize to JSON verification method and relationship populated', () =>{
        const controllerDocument = new ControllerDocument('test_identifier');
        const verificationMethod = {
            id: 'method_identifier',
            controller: 'test_identifier',
            type: VerificationMethodType.JsonWebKey2020,
            publicKeyJwk: {}
        };
        controllerDocument.addVerificationMethod(verificationMethod, [VerificationMethodRelationship.Authentication ] )
        const json = JSON.stringify(controllerDocument);
        expect(json).to.equal('{"id":"test_identifier","verificationMethods":[{"id":"method_identifier","controller":"test_identifier","type":"JsonWebKey2020","publicKeyJwk":{}}],"@context":["https://www.w3.org/ns/did/v1",{"@base":"test_identifier"}],"authentication":["method_identifier"]}');
    });

    it ('should add verification relationships when provided', () =>{
        const controllerDocument = new ControllerDocument('test_identifier');
        const verificationMethod = {
            id: 'method_identifier',
            controller: 'test_identifier',
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