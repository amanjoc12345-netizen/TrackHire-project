import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const hashCacheKey = (company, role, experience) => `${company}|${role}|${experience}`;

export const useInterviewStore = create(
  persist(
    (set, get) => ({
      company: '',
      role: 'Frontend Developer',
      experience: '1-2 Years',
      interviewDate: '',
      cacheKey: '',
      generatedData: {},
      roadmap: [],
      completedQuestions: [],
      bookmarkedQuestions: [],
      notes: [],
      sessionStarted: false,
      activeTab: 'overview',

      setSession: (company, role, experience) => {
        const newKey = hashCacheKey(company, role, experience);
        const prev = get();
        const cacheReusable = prev.cacheKey === newKey;
        set({
          company,
          role,
          experience,
          interviewDate: new Date().toISOString(),
          cacheKey: newKey,
          sessionStarted: true,
          activeTab: 'overview',
          generatedData: cacheReusable ? prev.generatedData : {},
          roadmap: cacheReusable ? prev.roadmap : [],
          completedQuestions: cacheReusable ? prev.completedQuestions : [],
          bookmarkedQuestions: cacheReusable ? prev.bookmarkedQuestions : []
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      resetSession: () => set({
        company: '',
        role: 'Frontend Developer',
        experience: '1-2 Years',
        interviewDate: '',
        cacheKey: '',
        generatedData: {},
        roadmap: [],
        completedQuestions: [],
        bookmarkedQuestions: [],
        notes: [],
        sessionStarted: false,
        activeTab: 'overview'
      }),

      getCached: (aiType) => {
        const { generatedData, cacheKey } = get();
        const entry = generatedData[aiType];
        if (entry && entry.cacheKey === cacheKey) {
          return entry.data;
        }
        return null;
      },

      setCached: (aiType, data) => {
        const { cacheKey, generatedData } = get();
        set({
          generatedData: {
            ...generatedData,
            [aiType]: { cacheKey, data }
          }
        });
      },

      toggleRoadmapStep: (id) => set((state) => ({
        roadmap: state.roadmap.map(s =>
          s.id === id ? { ...s, completed: !s.completed } : s
        )
      })),

      setRoadmap: (roadmap) => set({ roadmap }),

      toggleQuestionCompleted: (id) => set((state) => ({
        completedQuestions: state.completedQuestions.includes(id)
          ? state.completedQuestions.filter(q => q !== id)
          : [...state.completedQuestions, id]
      })),

      toggleQuestionBookmarked: (id) => set((state) => ({
        bookmarkedQuestions: state.bookmarkedQuestions.includes(id)
          ? state.bookmarkedQuestions.filter(q => q !== id)
          : [...state.bookmarkedQuestions, id]
      })),

      setNotes: (notes) => set({ notes })
    }),
    {
      name: 'trackhire-interview-session',
      version: 1
    }
  )
);
