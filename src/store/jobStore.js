import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useJobStore = create((set, get) => ({
  jobs: [],
  loading: false,
  error: null,

  fetchJobs: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    if (!db) {
      set({ error: 'Database service is not initialized. Please verify configuration.', loading: false });
      return;
    }
    try {
      const jobsRef = collection(db, 'jobs');
      const q = query(
        jobsRef, 
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const jobsList = [];
      querySnapshot.forEach((doc) => {
        jobsList.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort in memory by appliedDate descending to avoid composite index requirements
      jobsList.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
      
      set({ jobs: jobsList, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addJob: async (jobData) => {
    set({ loading: true, error: null });
    if (!db) {
      const err = new Error('Database service is not initialized. Please verify configuration.');
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const docRef = await addDoc(collection(db, 'jobs'), jobData);
      const newJob = { id: docRef.id, ...jobData };
      const updatedJobs = [newJob, ...get().jobs];
      // Keep sorted
      updatedJobs.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
      set({ jobs: updatedJobs, loading: false });
      return newJob;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateJob: async (jobId, updatedData) => {
    set({ loading: true, error: null });
    if (!db) {
      const err = new Error('Database service is not initialized. Please verify configuration.');
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const jobDocRef = doc(db, 'jobs', jobId);
      await updateDoc(jobDocRef, updatedData);
      const updatedJobs = get().jobs.map(job => 
        job.id === jobId ? { ...job, ...updatedData } : job
      );
      // Keep sorted
      updatedJobs.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
      set({ jobs: updatedJobs, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteJob: async (jobId) => {
    set({ loading: true, error: null });
    if (!db) {
      const err = new Error('Database service is not initialized. Please verify configuration.');
      set({ error: err.message, loading: false });
      throw err;
    }
    try {
      const jobDocRef = doc(db, 'jobs', jobId);
      await deleteDoc(jobDocRef);
      const updatedJobs = get().jobs.filter(job => job.id !== jobId);
      set({ jobs: updatedJobs });
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  }
}));

