import { create } from 'zustand';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { db, storage, auth } from '../firebase/config';
import { useAuthStore } from './authStore';

const DEFAULT_PROFILE = {
  fullName: '',
  email: '',
  phoneNumber: '',
  location: '',
  dob: '',
  gender: '',
  headline: '',
  aboutMe: '',
  currentRole: '',
  yearsOfExperience: 0,
  preferredJobRole: '',
  preferredLocation: '',
  expectedSalary: '',
  employmentType: '',
  workPreference: '',
  skills: [],
  socialLinks: {
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
  },
  resume: {
    url: '',
    name: '',
    lastUpdated: '',
  },
  photoURL: '',
};

export const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  saving: false,
  error: null,

  fetchProfile: async (uid) => {
    if (!uid) return;
    set({ loading: true, error: null });
    if (!db) {
      set({ error: "Database service is not initialized. Please verify configuration.", loading: false });
      return;
    }
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const mergedProfile = {
          ...DEFAULT_PROFILE,
          ...data,
          fullName: data.fullName || data.name || '',
          socialLinks: {
            ...DEFAULT_PROFILE.socialLinks,
            ...(data.socialLinks || {}),
          },
          resume: {
            url: data.resume?.url || data.resumeUrl || '',
            name: data.resume?.name || data.resumeFileName || '',
            lastUpdated: data.resume?.lastUpdated || (data.updatedAt?.toDate?.()?.toISOString()) || data.updatedAt || '',
          },
          skills: data.skills || [],
          photoURL: data.photoURL || data.profileImage || '',
        };
        set({ profile: mergedProfile, loading: false });
      } else {
        const currentUser = auth?.currentUser;
        const initialProfile = {
          ...DEFAULT_PROFILE,
          fullName: currentUser?.displayName || '',
          email: currentUser?.email || '',
          photoURL: currentUser?.photoURL || '',
        };
        await setDoc(docRef, {
          ...initialProfile,
          name: initialProfile.fullName,
          uid,
          createdAt: serverTimestamp(),
        });
        set({ profile: initialProfile, loading: false });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      set({ error: err.message || 'Failed to load profile details.', loading: false });
    }
  },

  updateProfile: async (uid, updatedFields) => {
    if (!uid) return;
    set({ saving: true, error: null });
    if (!db) {
      const err = new Error("Database service is not initialized.");
      set({ error: err.message, saving: false });
      throw err;
    }
    try {
      const docRef = doc(db, 'users', uid);
      const currentProfile = get().profile || DEFAULT_PROFILE;

      await updateDoc(docRef, {
        ...updatedFields,
        name: updatedFields.fullName || currentProfile.fullName,
        updatedAt: serverTimestamp(),
      });

      if (updatedFields.fullName && updatedFields.fullName !== currentProfile.fullName && auth?.currentUser) {
        await updateAuthProfile(auth.currentUser, {
          displayName: updatedFields.fullName,
        });
        
        const authUser = useAuthStore.getState().user;
        if (authUser) {
          useAuthStore.getState().setUser({
            ...authUser,
            displayName: updatedFields.fullName,
          });
        }
      }

      await get().fetchProfile(uid);
    } catch (err) {
      console.error('Error updating profile:', err);
      set({ error: err.message || 'Failed to save profile changes.' });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  uploadAvatar: async (uid, file) => {
    if (!uid || !file) return;
    set({ saving: true, error: null });
    if (!db || !storage) {
      const err = new Error("Database or Storage service is not initialized.");
      set({ error: err.message, saving: false });
      throw err;
    }
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Avatar image size must be under 2MB.');
      }

      const fileExtension = file.name.split('.').pop();
      const storageRef = ref(storage, `profile-images/${uid}/avatar_${Date.now()}.${fileExtension}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        photoURL: downloadURL,
        profileImage: downloadURL,
        updatedAt: serverTimestamp(),
      });

      if (auth?.currentUser) {
        await updateAuthProfile(auth.currentUser, {
          photoURL: downloadURL,
        });

        const authUser = useAuthStore.getState().user;
        if (authUser) {
          useAuthStore.getState().setUser({
            ...authUser,
            photoURL: downloadURL,
          });
        }
      }

      await get().fetchProfile(uid);
      return downloadURL;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      set({ error: err.message || 'Failed to upload profile picture.' });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  uploadResume: async (uid, file) => {
    if (!uid || !file) return;
    set({ saving: true, error: null });
    if (!db || !storage) {
      const err = new Error("Database or Storage service is not initialized.");
      set({ error: err.message, saving: false });
      throw err;
    }
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Resume file size must be under 5MB.');
      }

      const storageRef = ref(storage, `resumes/${uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const resumeData = {
        url: downloadURL,
        name: file.name,
        lastUpdated: new Date().toISOString(),
      };

      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        resume: resumeData,
        resumeUrl: downloadURL,
        resumeFileName: file.name,
        updatedAt: serverTimestamp(),
      });

      await get().fetchProfile(uid);
      return resumeData;
    } catch (err) {
      console.error('Error uploading resume:', err);
      set({ error: err.message || 'Failed to upload resume.' });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  deleteResume: async (uid) => {
    if (!uid) return;
    set({ saving: true, error: null });
    if (!db) {
      const err = new Error("Database service is not initialized.");
      set({ error: err.message, saving: false });
      throw err;
    }
    try {
      const docRef = doc(db, 'users', uid);
      
      const currentProfile = get().profile;
      if (storage && currentProfile?.resume?.url && currentProfile.resume.url.includes('firebasestorage')) {
        try {
          const storageRef = ref(storage, currentProfile.resume.url);
          await deleteObject(storageRef);
        } catch (storageErr) {
          console.error("Failed to delete resume file from Storage:", storageErr);
        }
      }
      
      const emptyResume = {
        url: '',
        name: '',
        lastUpdated: '',
      };

      await updateDoc(docRef, {
        resume: emptyResume,
        resumeUrl: '',
        resumeFileName: '',
        updatedAt: serverTimestamp(),
      });

      await get().fetchProfile(uid);
    } catch (err) {
      console.error('Error deleting resume:', err);
      set({ error: err.message || 'Failed to delete resume.' });
      throw err;
    } finally {
      set({ saving: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));

