// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

import ILogger from './ILogger';

/**
 * Encapsulates the context of a given request.
 */
export default interface IRequestContext {
  /**
   * Gives a context-aware logger instance
   */
  logger: ILogger;

  /**
   * Gives the identifier id from the request path.
   */
  identifier: string;

  /**
   * Gives the key identifier id from the request path.
   */
  keyIdentifier: string;

  /**
   * Gives the service identifier id from the request path.
   */
  serviceIdentifier: string;

  /**
   * Attempts to read the specified parameter from the query string.
   * @param {string} id of the parameter to be returned.
   * @param {T} [defaultIfMissing] to return if the parameter is missing or whitespace.
   */
  getQueryParameter<T> (id: string, defaultIfMissing?: T): T;

  /**
   * Attempts to read the specified parameter from the params array.
   * If the parameter exists its value is checked for whitespace, and
   * if not whitespace is URI decoded a returned.
   * @param {string} id of the parameter to be returned.
   * @returns {string} with the URI decoded value.
   */
  getPathParameter (id: string): string;

  /**
   * Transforms headers matching a given predicate
   * @param matching a predicate to be applied to all headers in the request.
   * @returns headers for which the predicate did not return undefined
   */
  getHeaders<T> (matching: (header: Record<string, string>) => T | undefined): T[];
}
