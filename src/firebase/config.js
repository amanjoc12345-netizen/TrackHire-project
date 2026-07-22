import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB4DKQ1NYaqoYJ2_A2_gKXOltmXjNBtrSw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'trackhire-42b62.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'trackhire-42b62',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'trackhire-42b62.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1036397272157',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1036397272157:web:470ad9d0440ef54ec6c1b4',
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  storage.maxUploadRetryTime = 3000;
  storage.maxOperationRetryTime = 3000;
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn('Firebase services initialized in degraded mode:', error.message);
}

export { app, auth, db, storage, googleProvider };
