// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import {
  AuthnIdentity,
  JwtAuthnIdentity,
  MemberCertAuthnIdentity,
  MemberCOSESign1AuthnIdentity,
  UserCertAuthnIdentity,
  UserCOSESign1AuthnIdentity,
} from '@microsoft/ccf-app';

const UNAUTHENTICATED: string = 'Unauthenticated';

/**
 * Class for wrapping the CCF {@link AuthnIdentity} class.
 */
export class AuthenticatedIdentity {
  /**
   * The identifier of the authenticated identity.
   */
  public identifier: string;

  /**
   * The identity policy matched by CCF.
   */
  public policy: string;

  /**
   * The COSE body of the authenticated identity.
   */
  public coseBody: string | undefined;

  /**
   * Constructs a new instance of the {@link AuthenticatedIdentity} class.
   * @param {AuthnIdentity} identity provided in request and matched by CCF.
   */
  constructor (public identity: AuthnIdentity) {
    this.identifier = identity ? AuthenticatedIdentity.getAuthenticatedIdentityIdentifier(identity) : UNAUTHENTICATED;
    this.policy = identity?.policy || 'no_auth';
    if (this.policy === 'user_cose_sign1' && (<UserCOSESign1AuthnIdentity>identity).cose.content.byteLength > 0) {
      this.coseBody = String.fromCharCode.apply(null, (new Uint8Array((<UserCOSESign1AuthnIdentity>identity).cose.content)));
    }
  }

  /**
   * Gets the identifier for the authenticated  identity.
   * @param {AuthnIdentity} identity for which to return the identifier.
   * @returns {string} with the identifier of the {@link AuthnIdentity} or 'Unauthenticated'.
   * @todo Work with CCF team to export the `UserMemberAuthnIdentityCommon` interface so that
   * the switch statement can be simplified to:
   * switch(authenticatedIdentity.policy) {
   *     case 'jwt':
   *       return (<JwtAuthnIdentity>authenticatedIdentity).jwt.keyIssuer;
   *     case 'member_cert':
   *     case 'member_signature':
   *     case 'user_cert':
   *     case 'user_signature':
   *       return (<UserMemberAuthnIdentityCommon>authenticatedIdentity).id;
   *     default:
   *       return 'Unauthenticated';
   * }
   */
  private static getAuthenticatedIdentityIdentifier (identity: AuthnIdentity): string {
    switch (identity.policy) {
      case 'jwt':
        return (<JwtAuthnIdentity>identity).jwt.keyIssuer;
      case 'member_cert':
        return (<MemberCertAuthnIdentity>identity).id;
      case 'user_cert':
        return (<UserCertAuthnIdentity>identity).id;
      case 'user_cose_sign1':
        return (<UserCOSESign1AuthnIdentity>identity).id;
      default:
        return UNAUTHENTICATED;
    }
  }
}
