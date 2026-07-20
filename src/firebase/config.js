import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingKeys = requiredKeys.filter(key => !import.meta.env[key]);

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;

if (missingKeys.length > 0) {
  console.error(
    `[Firebase Config Warning]: Missing required environment variables: ${missingKeys.join(', ')}.\n` +
    `Please ensure Vercel/environment configuration is set up properly.`
  );
} else {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    storage.maxUploadRetryTime = 3000;
    storage.maxOperationRetryTime = 3000;
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Firebase services failed to initialize:', error);
  }
}

export { app, auth, db, storage, googleProvider };


