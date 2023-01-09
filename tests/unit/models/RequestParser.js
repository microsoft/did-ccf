// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { RequestParser } from '../../../dist/src/models/RequestParser.js';
import { expect } from 'chai';

describe ('RequestParser', () => {
    it ('should construct a new instance', () => {
        
        const request = {
            params: {
                keyOne: "valueOne",
                keyTwo: "valueTwo", 
            },
            query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
        };
        
        const requestParser = new RequestParser(request);
        expect(requestParser).not.null;
    });

    describe ('getPathParameter', () => {
        it ('should return undefined when path parameter does not exist', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "valueTwo", 
                },
                query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getPathParameter('doesNotExist');
            expect(result).to.be.undefined;
        });

        it ('should return undefined when path parameter contains whitespace', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "%20%20", 
                },
                query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getPathParameter('keyTwo');
            expect(result).to.be.undefined;
        });

        it ('should return the expected value from path parameter', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "valueTwo", 
                },
                query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getPathParameter('keyTwo');
            expect(result).to.equal('valueTwo');
        });

        it ('should return a correctly decoded value from path parameter', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "%23valueTwo", 
                },
                query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getPathParameter('keyTwo');
            expect(result).to.equal('#valueTwo');
        });
    });

    describe ('getQueryParameter<T>', () => {
        it ('should return undefined when query parameter does not exist', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "valueTwo", 
                },
                query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getQueryParameter('doesNotExist');
            expect(result).to.be.undefined;
        });

        it ('should return undefined when query parameter contains whitespace', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "%20%20", 
                },
                query: "queryOne=%20%20&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getQueryParameter('queryOne');
            expect(result).to.be.undefined;
        });

        it ('should return an expected value from query parameter', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "valueTwo", 
                },
                query: "?queryOne=queryValueOne&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getQueryParameter('queryTwo');
            expect(result).to.equal('queryValueTwo');
        });

        it ('should return an correctly decoded value from query parameter', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "%23valueTwo", 
                },
                query: "queryOne=queryValueOne&queryTwo=%23queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getQueryParameter('queryTwo');
            expect(result).to.equal('#queryValueTwo');
        });

        it ('should return default value when query parameter does not exist', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "%23valueTwo", 
                },
                query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getQueryParameter('doesNotExit', 'defaultValue');
            expect(result).to.equal('defaultValue');
        });

        it ('should return default value when query parameter contains whitespace', () =>{
            
            const request = {
                params: {
                    keyOne: "valueOne",
                    keyTwo: "%23valueTwo", 
                },
                query: "queryOne=queryValueOne&queryTwo=%20%20"
            };
            
            const requestParser = new RequestParser(request);
            const result = requestParser.getQueryParameter('queryTwo', 'defaultValue');
            expect(result).to.equal('defaultValue');
        });
    });
})
