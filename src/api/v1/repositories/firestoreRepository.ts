import { db } from "../../../../config/firebaseConfig";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

type FirestoreDataTypes =
    | string
    | number
    | boolean
    | null
    | Timestamp
    | FieldValue;

interface FieldValuePair {
    fieldName: string;
    fieldValue: FirestoreDataTypes;
}

/**
 * Executes a series of operations within a Firestore transaction.
 * @param {(transaction: FirebaseFirestore.Transaction) => Promise<T>} operations - Function containing the operations to perform within the transaction.
 * @returns {Promise<T>} - The result of the transaction.
 */
export const runTransaction = async <T>(
    operations: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
    try {
        return await db.runTransaction(operations);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Transaction failed: ${errorMessage}`);
    }
};