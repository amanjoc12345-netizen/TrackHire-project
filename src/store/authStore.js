import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

const syncUserDocument = async (user) => {
  if (!db) {
    console.warn("Database not initialized. Skipping user document sync.");
    return;
  }
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error syncing user document to Firestore:", error);
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error: error ? error.message || error : null }),

  // Initialize auth listener
  initAuthListener: () => {
    set({ loading: true });
    
    if (!auth) {
      set({ 
        user: null, 
        loading: false, 
        error: "Authentication service is not initialized. Please verify configuration." 
      });
      return () => {};
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const formattedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        set({
          user: formattedUser,
          loading: false,
          error: null
        });
        await syncUserDocument(formattedUser);
      } else {
        set({ user: null, loading: false });
      }
    });

    return unsubscribe;
  },

  // Email & Password login
  login: async (email, password) => {
    set({ loading: true, error: null });
    if (!auth) {
      const err = new Error("Authentication service is not initialized. Please verify configuration.");
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const formattedUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      set({ user: formattedUser, loading: false });
      await syncUserDocument(formattedUser);
      return formattedUser;
    } catch (error) {
      set({ error: error.message || error, loading: false });
      throw error;
    }
  },

  // Email & Password registration
  register: async (email, password, displayName) => {
    set({ loading: true, error: null });
    if (!auth) {
      const err = new Error("Authentication service is not initialized. Please verify configuration.");
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      const formattedUser = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
      };
      set({ user: formattedUser, loading: false });
      await syncUserDocument(formattedUser);
      return formattedUser;
    } catch (error) {
      set({ error: error.message || error, loading: false });
      throw error;
    }
  },

  // Google OAuth Sign-In
  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    if (!auth) {
      const err = new Error("Authentication service is not initialized. Please verify configuration.");
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const formattedUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      set({ user: formattedUser, loading: false });
      await syncUserDocument(formattedUser);
      return formattedUser;
    } catch (error) {
      set({ error: error.message || error, loading: false });
      throw error;
    }
  },

  // Log Out
  logout: async () => {
    set({ loading: true, error: null });
    if (!auth) {
      const err = new Error("Authentication service is not initialized. Please verify configuration.");
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message || error, loading: false });
      throw error;
    }
  },
  
  clearError: () => set({ error: null })
}));
