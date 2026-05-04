// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "foodziee-32cbe.firebaseapp.com",
  projectId: "foodziee-32cbe",
  storageBucket: "foodziee-32cbe.firebasestorage.app",
  messagingSenderId: "772372084875",
  appId: "1:772372084875:web:54e1339380d0e4457f7c8e",
  measurementId: "G-8R19TLQYKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

const auth = getAuth(app);

export { app, auth, analytics };
