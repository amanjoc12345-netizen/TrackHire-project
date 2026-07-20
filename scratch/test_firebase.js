import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';

// Parse .env manually
try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        value = value.trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Error reading .env manually:", e);
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

async function run() {
  try {
    const email = `testuser_${Date.now()}@example.com`;
    const password = "password123";
    console.log(`Registering new test user: ${email}...`);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    console.log(`Successfully registered. User UID: ${uid}`);

    // Create user document first since rule might require it
    console.log(`\nCreating initial user document at users/${uid}...`);
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      uid,
      name: "Test User",
      email,
      createdAt: new Date().toISOString()
    });
    console.log("Initial user doc created.");

    // Test 3b: Upload to Storage profile-images/{uid}/...
    console.log(`\nTest 3b: Uploading to profile-images/${uid}/...`);
    const mockImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const avatarRef2 = ref(storage, `profile-images/${uid}/avatar_${Date.now()}.png`);
    try {
      const uint8Array = new Uint8Array(mockImageBuffer);
      await uploadBytes(avatarRef2, uint8Array);
      const url2 = await getDownloadURL(avatarRef2);
      console.log(`Test 3b Success (profile-images/${uid}/...): Uploaded! URL: ${url2}`);
    } catch (err) {
      console.error(`Test 3b Failed (profile-images/${uid}/...):`);
      console.dir(err, { depth: null });
    }

  } catch (err) {
    console.error("\nOverall test runner caught error:", err);
  }
}

run();
