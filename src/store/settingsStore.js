import { create } from 'zustand';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const DEFAULT_SETTINGS = {
  notifications: {
    emailNotifications: true,
    resumeAnalysisComplete: true,
    weeklyTips: false,
    newFeatures: true,
    marketingEmails: false,
  },
  preferences: {
    theme: 'system',
    language: 'en',
    fontSize: 'base',
    fontFamily: 'sans',
    enableAnimations: true,
    compactMode: false,
    autoSaveDrafts: true,
  }
};

export const useSettingsStore = create((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,
  saving: false,
  error: null,

  fetchSettings: async (uid) => {
    if (!uid) return;
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const settings = {
          notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...(data.settings?.notifications || {}),
          },
          preferences: {
            ...DEFAULT_SETTINGS.preferences,
            ...(data.settings?.preferences || {}),
          }
        };
        set({ settings, loading: false });
      } else {
        set({ settings: DEFAULT_SETTINGS, loading: false });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      set({ error: err.message, loading: false });
    }
  },

  updateSettings: async (uid, section, updatedFields) => {
    if (!uid) return;
    const currentSettings = get().settings;
    const newSettings = {
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        ...updatedFields
      }
    };
    
    // Optimistic update
    set({ settings: newSettings, error: null });

    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        settings: newSettings
      });
    } catch (err) {
      console.error('Error saving settings:', err);
      // Rollback on error
      set({ settings: currentSettings, error: err.message });
      throw err;
    }
  }
}));
