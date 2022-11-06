import { EcdsaCurve } from './EcdsaCurve';
import { EcdsaKeyPair } from './EcdsaKeyPair';
import { EddsaCurve } from './EddsaCurve';
import { EddsaKeyPair } from './EddsaKeyPair';
import { KeyAlgorithm } from './KeyAlgorithm';
import { RsaKeyPair } from './RsaKeyPair';
import { KeyPair } from './KeyPair';

/**
 * Factory class for creating instances of {@link KeyPair}'s.
 */
export class KeyPairCreator {
    /**
    * Creates a new instance of a {@link KeyPair} for the specified {@link KeyAlgorithm}.
    * @param {KeyAlgorithm} algorithm type for the key. 
    * @param {number} [size] for the key if algorithm type is {@link KeyAlgorithm.Rsa}.  
    * @param {EcdsaCurve | EddsaCurve} [curve] for the key if algorithm type is {@link KeyAlgorithm.EcdsaCurve} or {@link KeyAlgorithm.EddsaCurve}.
    */
    static createKey(algorithm: KeyAlgorithm, size?: number, curve?: EcdsaCurve | EddsaCurve): KeyPair {

        switch (algorithm) {
            case KeyAlgorithm.Rsa:
                return new RsaKeyPair(size);
            case KeyAlgorithm.Ecdsa:
                return new EcdsaKeyPair(<EcdsaCurve>curve);
            case KeyAlgorithm.Eddsa:
                return new EddsaKeyPair();
        }
    }
}