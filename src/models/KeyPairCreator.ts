// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { EcdsaCurve } from './EcdsaCurve';
import { EcdsaKeyPair } from './EcdsaKeyPair';
import { EddsaCurve } from './EddsaCurve';
import { EddsaKeyPair } from './EddsaKeyPair';
import { KeyAlgorithm } from './KeyAlgorithm';
import { KeyPair } from './KeyPair';
import { KeyUse } from './KeyUse';
import { RsaKeyPair } from './RsaKeyPair';

/**
 * Factory class for creating instances of {@link KeyPair}'s.
 */
export class KeyPairCreator {
   /**
    * Creates a new instance of a {@link KeyPair} for the specified {@link KeyAlgorithm}.
    * @param {KeyAlgorithm} algorithm type for the key.
    * @param {number} [size] for the key if algorithm type is {@link KeyAlgorithm.Rsa}.
    * @param {EcdsaCurve | EddsaCurve} [curve] for the key if algorithm type is {@link KeyAlgorithm.Ecdsa} or {@link KeyAlgorithm.Eddsa}.
    */
  public static createSigningKey (algorithm: KeyAlgorithm, size?: number, curve?: EcdsaCurve | EddsaCurve): KeyPair {
    return KeyPairCreator.createKey(algorithm, KeyUse.Signing, size);
  }

  /**
   * Creates a new instance of a {@link KeyPair} for the specified {@link KeyAlgorithm}.
   * @param {KeyAlgorithm} algorithm type for the key.
   * @param {number} [size] for the key if algorithm type is {@link KeyAlgorithm.Rsa}.
   * @param {EcdsaCurve | EddsaCurve} [curve] for the key if algorithm type is {@link KeyAlgorithm.Ecdsa} or {@link KeyAlgorithm.Eddsa}.
   */
  public static createEncryptionKey (algorithm: KeyAlgorithm, size?: number, curve?: EcdsaCurve | EddsaCurve): KeyPair {
    return KeyPairCreator.createKey(algorithm, KeyUse.Encryption, size, curve);
  }

  /**
   * Creates a new instance of a {@link KeyPair} for the specified {@link KeyAlgorithm}.
   * @param {KeyAlgorithm} algorithm type for the key.
   * @param {KeyUse} [use=KeyUse.Signing] indicating what the key can be used for.
   * @param {number} [size] for the key if algorithm type is {@link KeyAlgorithm.Rsa}.
   * @param {EcdsaCurve | EddsaCurve} [curve] for the key if algorithm type is {@link KeyAlgorithm.Ecdsa} or {@link KeyAlgorithm.Eddsa}.
   */
  public static createKey (algorithm: KeyAlgorithm, use: KeyUse, size?: number, curve?: EcdsaCurve | EddsaCurve): KeyPair {
    let keyPair: KeyPair;
    switch (algorithm) {
      case KeyAlgorithm.Rsa:
        keyPair = new RsaKeyPair(size, use);
        console.log(`RsaKeyPair with key size '${size}' created for use as a '${use}' key.`);
        break;
      case KeyAlgorithm.Ecdsa:
        keyPair = new EcdsaKeyPair(<EcdsaCurve>curve, use);
        console.log(`EcdsaKeyPair with curve '${curve}' created for use as a '${use}' key.`);
        break;
      case KeyAlgorithm.Eddsa:
      default:
        keyPair = new EddsaKeyPair(use);
        console.log(`EddsaKeyPair with curve 'Curve25519' created for use as a '${use}' key.`);
        break;
    }

    return keyPair;
  }
}
