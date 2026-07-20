import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
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

async function run() {
  try {
    const email = `testuser_del_${Date.now()}@example.com`;
    const password = "password123";
    console.log(`Registering new test user: ${email}...`);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    console.log(`Successfully registered. User UID: ${uid}`);

    // Create user document first
    console.log(`\nCreating initial user document...`);
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { uid, name: "Test User", email });
    console.log("User document created.");

    // Test 1: generatedResumes subcollection delete
    console.log(`\nTesting subcollection generatedResumes create and delete...`);
    const resumesRef = collection(db, 'users', uid, 'generatedResumes');
    const resumeDocRef = await addDoc(resumesRef, { title: "Test Resume", createdAt: new Date().toISOString() });
    console.log(`Created resume doc: ${resumeDocRef.id}`);
    try {
      await deleteDoc(doc(db, 'users', uid, 'generatedResumes', resumeDocRef.id));
      console.log("Success: Deleted resume doc from subcollection!");
    } catch (err) {
      console.error("Failed to delete resume doc from subcollection:", err.message);
    }

    // Test 2: jobs collection delete
    console.log(`\nTesting jobs collection create and delete...`);
    const jobsRef = collection(db, 'jobs');
    const jobDocRef = await addDoc(jobsRef, { userId: uid, company: "Test Company", appliedDate: new Date().toISOString() });
    console.log(`Created job doc: ${jobDocRef.id}`);
    try {
      await deleteDoc(doc(db, 'jobs', jobDocRef.id));
      console.log("Success: Deleted job doc from collection!");
    } catch (err) {
      console.error("Failed to delete job doc from collection:", err.message);
    }

    // Test 3: analysisHistory collection delete
    console.log(`\nTesting analysisHistory collection create and delete...`);
    const historyRef = collection(db, 'analysisHistory');
    const historyDocRef = await addDoc(historyRef, { userId: uid, company: "Test Company", createdAt: new Date().toISOString() });
    console.log(`Created analysisHistory doc: ${historyDocRef.id}`);
    try {
      await deleteDoc(doc(db, 'analysisHistory', historyDocRef.id));
      console.log("Success: Deleted analysisHistory doc from collection!");
    } catch (err) {
      console.error("Failed to delete analysisHistory doc from collection:", err.message);
    }

  } catch (err) {
    console.error("Overall test caught error:", err);
  }
}

run();
