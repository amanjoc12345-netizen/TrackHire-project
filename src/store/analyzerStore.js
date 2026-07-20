import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useAnalyzerStore = create((set, get) => ({
  history: [],
  loading: false,
  error: null,

  fetchHistory: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    if (!db) {
      set({ error: 'Database service is not initialized. Please verify configuration.', loading: false });
      return;
    }
    try {
      const historyRef = collection(db, 'analysisHistory');
      const q = query(
        historyRef, 
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const historyList = [];
      querySnapshot.forEach((doc) => {
        historyList.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort in memory by createdAt descending
      historyList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      set({ history: historyList, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  saveAnalysis: async (analysisRecord) => {
    set({ loading: true, error: null });
    if (!db) {
      const err = new Error('Database service is not initialized. Please verify configuration.');
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const docRef = await addDoc(collection(db, 'analysisHistory'), analysisRecord);
      const newRecord = { id: docRef.id, ...analysisRecord };
      const updatedHistory = [newRecord, ...get().history];
      set({ history: updatedHistory, loading: false });
      return newRecord;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteAnalysis: async (analysisId) => {
    set({ loading: true, error: null });
    if (!db) {
      const err = new Error('Database service is not initialized. Please verify configuration.');
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const docRef = doc(db, 'analysisHistory', analysisId);
      await deleteDoc(docRef);
      const updatedHistory = get().history.filter(item => item.id !== analysisId);
      set({ history: updatedHistory });
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  }
}));

