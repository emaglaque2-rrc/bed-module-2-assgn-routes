import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// You'll need to replace this with your actual service account file name
import serviceAccount from "../back-end-project-module3-firebase-adminsdk-fbsvc-1ff4295670.json";

// initialize the Firebase app with our service account key
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

// get a reference to the firestore database
// This creates a Firestore instance that you can use to interact with your database
const db: Firestore = getFirestore();

export { db };
