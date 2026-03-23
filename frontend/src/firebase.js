import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// These values should be placed in frontend/.env (create one if it doesn't exist)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
