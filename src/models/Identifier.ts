// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { AuthenticatedIdentity } from './AuthenticatedIdentity';
import { ControllerDocument } from './ControllerDocument';
import { KeyPair } from './KeyPair';
import { KeyState } from './KeyState';
import { KeyUse } from './KeyUse';

/**
 * A class for defining an identifier along with its {@link KeyPair}'s, controller
 * and document.
 */
export class Identifier {
  /**
   * Constructs a new instance of the class.
   * @param {string} id used as the index for the identifier.
   * @param {string} controller user/member that the keys are associated with.
   * @param {ControllerDocument} controllerDocument for the identifier.
   * @param {KeyPair[]} keyPairs for the identifier.
   * @param {string} [controllerDelegate] user/member that control of the identifier has been delegated to.
   */
  constructor (
    public id: string,
    public controller: string,
    public controllerDocument: ControllerDocument,
    public keyPairs: KeyPair[],
    public controllerDelegate?: string) {
  }

  /**
   * Returns a value indicating whether the specified {@param authenticatedIdentity} is the
   * controller of the identifier and it's keys.
   * @param {AuthenticatedIdentity} authenticatedIdentity to check if it is the controller of the identifier.
   * @returns a boolean indicating whether the specified {@param authenticatedIdentity} is the
   * controller of the identifier and it's keys.
   */
  public isController (authenticatedIdentity: AuthenticatedIdentity): boolean {
    // Is the authenticated identity the controller of the identifier? If
    // not check if control has been delegated to the authenticated identity. If
    // neither are true then return false, otherwise return true indicating that
    // the authenticated identity is able to perform operations on the identifier.
    return (authenticatedIdentity.identifier === this.controller ||
            authenticatedIdentity.identifier === this.controllerDelegate);
  }

  /**
   * Attempts to return the current key from the list by
   * checking for a key with {@link KeyState} of current.
   * @param {KeyUse} [use=KeyUse.Signing] indicating the type of current key to return.
   * @returns The {@link KeyPair} for the current key.
   */
  public getCurrentKey (use: KeyUse = KeyUse.Signing): KeyPair | void {
    // Attempt to get the current key for the identifier.
    const keyPair = this.keyPairs?.find(key => key.state === KeyState.Current && key.use === use);

    if (keyPair) {
      return Object.setPrototypeOf(keyPair, KeyPair.prototype);
    }

    return;
  }

  /**
   * Attempts to return the specified key from the list.
   * @param {string} keyIdentifier for the {@link KeyPair}
   * @returns The {@link KeyPair} for the specified key.
   */
  public getKeyById (keyIdentifier: string): KeyPair | void {
    const keyPair =  this.keyPairs?.find(key => key.id === keyIdentifier);

    if (keyPair) {
      return Object.setPrototypeOf(keyPair, KeyPair.prototype);
    }

    return;
  }
}
