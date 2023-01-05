import { AuthenticatedRequestError } from './AuthenticatedRequestError';
import { ErrorCodes } from './ErrorCodes';
import { AuthenticatedIdentity } from '../models/AuthenticatedIdentity';

/**
 * Error for indicating that an attempted indetifier operation is being executed
 * by a member that is not the controller of the identifier.
 */
export class InvalidController extends AuthenticatedRequestError {
  /**
   * Constructs a new instance of the {@link InvalidController} class.
   * @param {AuthenticatedIdentity} authenicatedIdentity making the request.
   */
  constructor (public authenticatedIdentity: AuthenticatedIdentity) {
    super(
      authenticatedIdentity, 
      ErrorCodes.InvalidController, 
      `User/Member '${authenticatedIdentity.identifier}' attempted an operation on an identifier that is not under their control.`,
      400);
  }
}
