import admin from "firebase-admin";

let firebaseReady = false;

const initFirebaseAdmin = () => {
  if (firebaseReady) return true;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return false;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  firebaseReady = true;
  return true;
};

export const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken) {
    const error = new Error("Missing Firebase ID token.");
    error.statusCode = 400;
    throw error;
  }

  if (!initFirebaseAdmin()) {
    const error = new Error(
      "Firebase Admin is not configured on server. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
    );
    error.statusCode = 500;
    throw error;
  }

  return admin.auth().verifyIdToken(idToken, true);
};

