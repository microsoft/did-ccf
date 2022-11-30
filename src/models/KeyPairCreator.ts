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
       
        let keyPair: KeyPair;
        switch (algorithm) {
            case KeyAlgorithm.Rsa:
                keyPair = new RsaKeyPair(size);
                console.log(`RsaKeyPair with key size '${size}' created.`);
                break;
            case KeyAlgorithm.Ecdsa:
                
                keyPair = new EcdsaKeyPair(<EcdsaCurve>curve);
                console.log(`EcdsaKeyPair with curve '${curve}' created.`);
                break;
            case KeyAlgorithm.Eddsa:
                keyPair = new EddsaKeyPair();
                console.log(`EddsaKeyPair with curve 'Curve25519' created.`);
                break;
        }

        return keyPair;
    }
}