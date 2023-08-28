// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
  AuthnIdentity, Body, Request, UserCOSESign1AuthnIdentity,
} from '@microsoft/ccf-app';
import { AuthenticatedIdentity } from './AuthenticatedIdentity';

/**
 * Class for wrapping the CCF {@link AuthnIdentity} class.
 */
export class AuthenticatedRequest {
  /**
   * The authenticated identity making the request.
   */
  public authenticatedIdentity: AuthenticatedIdentity;

  /**
   * The body of the authenticated identity.
   * The COSE body if the identiy is a COSE identity.
   * The standard request body if the identity is not a COSE identity.
   */
  public body: string | Body | undefined;

  constructor (request: Request) {
    this.authenticatedIdentity = new AuthenticatedIdentity(request.caller);
    if (this.authenticatedIdentity.policy === 'user_cose_sign1' && (<UserCOSESign1AuthnIdentity>request.caller).cose.content.byteLength > 0) {
      this.body = <string>String.fromCharCode.apply(null, (new Uint8Array((<UserCOSESign1AuthnIdentity>request.caller).cose.content)));
    } else if (request.body) {
      this.body = request.body;
    }
  }

  /**
   * Gets the JSON request body for the authenticated request
   */
  public get jsonBody (): any {
    if (this.authenticatedIdentity.policy === 'user_cose_sign1') {
      return JSON.parse(<string>this.body);
    } else {
      return (<Body>this.body).json();
    }
  }

  /**
   * Gets the Text request body for the authenticated request
   */
  public get textBody (): string {
    if (this.authenticatedIdentity.policy === 'user_cose_sign1') {
      return <string>this.body;
    } else {
      return (<Body>this.body).text();
    }
  }
}
