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

/**
 * Creates a new document in a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @param {Partial<T>} data - The data for the new document.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export const createDocument = async <T>(
    collectionName: string,
    data: Partial<T>,
    id?: string
): Promise<string> => {
    try {
        let docRef: FirebaseFirestore.DocumentReference;

        if (id) {
            docRef = db.collection(collectionName).doc(id);
            await docRef.set(data);
        } else {
            docRef = await db.collection(collectionName).add(data);
        }

        return docRef.id;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create document in ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Retrieves all documents from a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @returns {Promise<FirebaseFirestore.QuerySnapshot>} - A QuerySnapshot containing all documents.
 */
export const getDocuments = async (
    collectionName: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
    try {
        return await db.collection(collectionName).get();
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to fetch documents from ${collectionName}: ${errorMessage}`
        );
    }
};