// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * Enumeration of request parameters.
 */
export enum RequestParameters {
    /**
     * Algorithm query string parameter for specifying
     * which {@link KeyAlgorithm} to use.
     */
    Algorithm = 'alg',

    /**
     * Curve query string parameter for specifying
     * which {@link EcdsaCurve | EddsaCurve} to use.
     */
    Curve = 'curve',

    /**
     * On behalf of query string parameter.
     */
    OnBehalfOf = 'obo',

    /**
     * Identifier path parameter.
     */
    Identifier = 'id',

    /**
     * Key Identifier path parameter.
     */
    KeyIdentifier = 'kid',

    /**
     * Key Size query string parameter for specifying
     * which .
     */
    KeySize = 'size',

    /**
     * Service identifier path parameter.
     */
    ServiceIdentifier = 'service',

    /**
     * Domain identifier path parameter.
     */
    Domain = 'domain',
}
