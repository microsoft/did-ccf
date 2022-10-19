import ControllerDocument from "./ControllerDocument";
import { KeyPair } from "./KeyPair";

/**
 * Model for representing a members identifier keys
 * in PEM format.
 */
 export default interface MemberIdentifierKeys {

    /**
     * The consortium member id that the
     * keys are associated with.
     */
    memberId: string;

    /**
     * The {@link ControllerDocument} representing the
     * latest state of the identifier.
     */
    controllerDocument: ControllerDocument;

    /**
     * Array of {@link KeyPair} objects.
     */
    keyPairs: KeyPair[];
}