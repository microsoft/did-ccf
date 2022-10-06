/**
 * Enumeration representing {@link https://www.w3.org/TR/did-core/#verification-relationships}
 * supported by the CCF app.
 */
export enum VerificationMethodRelationships {
    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#authentication}.
     */
    authentication = 'authentication',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#assertion}.
    */
    assertionMethod = 'assertionMethod',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#key-agreement}.
     */
    keyAgreement = 'keyAgreement',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#capability-invocation}.
     */
    capabilityInvocation = 'capabilityInvocation',

    /**
     * Enum value for {@link https://www.w3.org/TR/did-core/#capability-delegation}.
     */
    capabilityDelegation = 'capabilityDelegation',
}
