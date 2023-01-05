import {
  AuthnIdentity,
  JwtAuthnIdentity,
  MemberCertAuthnIdentity,
  MemberSignatureAuthnIdentity,
  UserCertAuthnIdentity, 
  UserSignatureAuthnIdentity
} from '@microsoft/ccf-app';

const UNAUTHENTICATED: string = 'Unauthenticated';

/**
 * Class for wrapping the CCF {@link AuthnIdentity} class.
 */
export class AuthenticatedIdentity {
  /**
   * The identifier of the authenticated identity.
   */
  identifier: string;

  /**
   * The identity policy matched by CCF.
   */
  policy: string;

  /**
   * Constructs a new instance of the {@link AuthenticatedIdentity} class.
   * @param {AuthnIdentity} identity provided in request and matched by CCF. 
   */
  constructor (public identity: AuthnIdentity) {
      this.identifier = identity ? AuthenticatedIdentity.getAuthenicatedIdentityIdentifier(identity) : UNAUTHENTICATED;
      this.policy = identity?.policy || 'no_auth';
  }

  /**
   * Gets the identifier for the authenticated  identity.
   * @param {AuthnIdentity} authenicatedIdentity for which to return the identifier.
   * @returns {string} with the identifier of the {@link AuthnIdentity} or 'Unauthenticated'.
   * @todo Work with CCF team to export the `UserMemberAuthnIdentityCommon` interface so that
   * the switch statement can be simplified to:
   * switch(authenicatedIdentity.policy) {
        case 'jwt':
          return (<JwtAuthnIdentity>authenicatedIdentity).jwt.keyIssuer;
        case 'member_cert':
        case 'member_signature':
        case 'user_cert':
        case 'user_signature':
          return (<UserMemberAuthnIdentityCommon>authenicatedIdentity).id;
        default:
          return 'Unauthenticated';
      }
   */  
    private static getAuthenicatedIdentityIdentifier (identity: AuthnIdentity): string {
      switch(identity.policy) {
        case 'jwt':
          return (<JwtAuthnIdentity>identity).jwt.keyIssuer;
        case 'member_cert':
          return (<MemberCertAuthnIdentity>identity).id;
        case 'member_signature':
          return (<MemberSignatureAuthnIdentity>identity).id;
        case 'user_cert':
          return (<UserCertAuthnIdentity>identity).id;
        case 'user_signature':
          return (<UserSignatureAuthnIdentity>identity).id;
        default:
          return UNAUTHENTICATED;
      }
    }
}
