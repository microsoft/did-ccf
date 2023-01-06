// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * @enum representing {@link https://www.w3.org/TR/did-core/#verification-relationships}
 * supported by the CCF app.
 */
export enum VerificationMethodRelationship {
    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#authentication}.
     */
    Authentication = 'authentication',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#assertion}.
    */
    AssertionMethod = 'assertionMethod',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#key-agreement}.
     */
    KeyAgreement = 'keyAgreement',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#capability-invocation}.
     */
    CapabilityInvocation = 'capabilityInvocation',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#capability-delegation}.
     */
    CapabilityDelegation = 'capabilityDelegation',
}
