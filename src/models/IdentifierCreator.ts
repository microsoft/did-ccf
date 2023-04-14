// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { ControllerDocument } from './ControllerDocument';
import { Identifier } from './Identifier';
import { KeyPair } from './KeyPair';
import { VerificationMethodRelationship } from './VerificationMethodRelationship';
import { VerificationMethodType } from './VerificationMethodType';

/**
 * Factory class for creating {@link Identifier} instances
 */
export class IdentifierCreator {
  /**
   * Creates a new instance of {@link Identifier}
   * @param signingKeyPair key (pair) to use for signing
   * @param encryptionKeyPair key (pair) to use for encryption
   * @param id the identifier's assigned identifier
   * @param controller the document controller
   * @param controllerDelegate optionally, another entity to which control of the document is to be delegated
   * @returns a new instance of {@link Identifier}
   */
  public static createIdentifier (
    signingKeyPair: KeyPair,
    encryptionKeyPair: KeyPair,
    identifierComponents: string[],
    controller: string,
    controllerDelegate?: string): Identifier {
    // Create the identifier for the document
    const did = `did:ccf:${identifierComponents.join(':')}`;
    const controllerDocument = new ControllerDocument(did);

    // Add the signing key
    controllerDocument.addVerificationMethod({
      id: `#${signingKeyPair.id}`,
      controller: did,
      type: VerificationMethodType.JsonWebKey2020,
      publicKeyJwk: signingKeyPair.asJwk(false),
    }, [VerificationMethodRelationship.Authentication, VerificationMethodRelationship.AssertionMethod]);

    // Add the encryption key
    controllerDocument.addVerificationMethod({
      id: `#${encryptionKeyPair.id}`,
      controller: did,
      type: VerificationMethodType.JsonWebKey2020,
      publicKeyJwk: encryptionKeyPair.asJwk(false),
    }, [VerificationMethodRelationship.KeyAgreement]);

    // We use the last identifier component as the Identifier's identifier
    const identifierId = identifierComponents[(identifierComponents.length - 1)];
    return <Identifier> {
      id: identifierId,
      controller,
      controllerDocument,
      keyPairs: [signingKeyPair, encryptionKeyPair],
      controllerDelegate,
    };
  }
}
