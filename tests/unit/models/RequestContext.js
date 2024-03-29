// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { RequestContext } from '../../../dist/src/models/RequestContext.js';
import { expect } from 'chai';

describe ('RequestContext', () => {
    it ('should construct a new instance', () => {
        
        const request = {
            params: {
                keyOne: "valueOne",
                keyTwo: "valueTwo", 
            },
            query: "queryOne=queryValueOne&queryTwo=queryValueTwo"
        };
        
        const context = new RequestContext(request);
        expect(context).not.null;
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
            
            const context = new RequestContext(request);
            const result = context.getPathParameter('doesNotExist');
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
            
            const context = new RequestContext(request);
            const result = context.getPathParameter('keyTwo');
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
            
            const context = new RequestContext(request);
            const result = context.getPathParameter('keyTwo');
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
            
            const context = new RequestContext(request);
            const result = context.getPathParameter('keyTwo');
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
            
            const context = new RequestContext(request);
            const result = context.getQueryParameter('doesNotExist');
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
            
            const context = new RequestContext(request);
            const result = context.getQueryParameter('queryOne');
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
            
            const context = new RequestContext(request);
            const result = context.getQueryParameter('queryTwo');
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
            
            const context = new RequestContext(request);
            const result = context.getQueryParameter('queryTwo');
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
            
            const context = new RequestContext(request);
            const result = context.getQueryParameter('doesNotExit', 'defaultValue');
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
            
            const context = new RequestContext(request);
            const result = context.getQueryParameter('queryTwo', 'defaultValue');
            expect(result).to.equal('defaultValue');
        });
    });
})
