// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Response } from '@microsoft/ccf-app';
import { AuthenticatedIdentity } from '../models';
import { ErrorCodes } from './ErrorCodes';

/**
 * Standardized error class for throwing a {@link RequestError} that has
 * been made by a CCF authenticated identity.
 */
export class AuthenticatedRequestError extends Error {
  /**
   * Constructs a new instance of the {@link AuthenticatedRequestError} class.
   * @param {AuthenticatedIdentity} authenticatedIdentity making the request.
   * @param {ErrorCodes} code for the instance.
   * @param {string} message for the instance.
   * @param {number} [httpStatus=500] to return in the response.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity, public code: ErrorCodes, public message: string, public httpStatus: number = 500) {
    super(`${code}: ${message}`);

    // NOTE: Extending 'Error' breaks prototype chain since TypeScript 2.1.
    // The following line restores prototype chain.
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Formats the error and returns a CCF {@link Response}.
   */
  public toErrorResponse (): Response  {
    return {
      statusCode: this.httpStatus,
      body: {
        error : {
          code: this.code,
          message: this.message,
          authentication: {
            userMemberIdentifier: this.authenticatedIdentity.identifier,
            matchedPolicy: this.authenticatedIdentity.policy,
          },
        },
      },
    };
  }
}
