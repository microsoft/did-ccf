// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * Enumeration defining error codes.
 */
export enum ErrorCodes {
  /**
   * Indicates that an identifier does not have a signing key
   * configured (a key marked as current).
   */
  SigningKeyNotConfigured = 'key_operation.signing_key_not_configured',

  /**
   * Indicates that an identifier has not been provided in the
   * request.
   */
  IdentifierProvidedNotProvidedForResolution = 'resolution_request.identifier_not_provided',

  /**
   * Indicates that an provided identifier has not been found on the network.
   */
  IdentifierNotFoundResolution = 'resolution_request.identifier_not_found',

  /**
   * Indicates that an identifier has not been provided in the
   * request.
   */
  IdentifierNotProvided = 'request.identifier_not_provided',

  /**
   * Indicates that an provided identifier has not been found on the network.
   */
  IdentifierNotFound = 'request.identifier_not_found',

  /**
   * Indicates that an a member is not the controller of a provided
   * identifier.
   */
  InvalidController = 'request.invalid_controller',

  /**
   * Indicates that a specified service does not containing the expected
   * properties.
   */
  InvalidService = 'request.invalid_service',

  /**
   * Indicates that an identifier does not have the specified
   * key in it's key list.
   */
  KeyNotFound = 'key_operation.key_not_found',

  /**
   * Indicates that no payload has been provided in the
   * request.
   */
  PayloadNotProvided = 'request.payload_not_provided',

  /**
   * Indicates that a service was not provided in the request.
   */
  ServiceNotProvided = 'request.service_not_provided',

  /**
   * Indicates that a service identifier was not provided in the request.
   */
  ServiceIdentifierNotProvided = 'request.service_identifier_not_provided',

  /**
   * Indicates that no signature has been provided in the
   * request.
   */
  SignatureNotProvided = 'request.signature_not_provided',

  /**
   * Indicates that a domain has not been registered.
   */
  DomainNotFound = 'request.domain_not_found',
}
