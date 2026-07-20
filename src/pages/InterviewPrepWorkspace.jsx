import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { useAuthStore } from '../store/authStore';
import { useInterviewStore } from '../store/interviewStore';
import {
  Building,
  HelpCircle,
  BookOpen,
  TrendingUp,
  FileText,
  Sparkles,
  Map,
  ArrowRight,
  Info,
  Award,
  ChevronRight
} from 'lucide-react';

import { PrepDashboardView } from '../components/prep/PrepDashboardView';
import { RoadmapView } from '../components/prep/RoadmapView';
import { QuestionsView } from '../components/prep/QuestionsView';
import { ResourcesView } from '../components/prep/ResourcesView';
import { ProgressView } from '../components/prep/ProgressView';
import { NotesView } from '../components/prep/NotesView';
import { CoachView } from '../components/prep/CoachView';
import { MockInterviewView } from '../components/prep/MockInterviewView';
import { CompanyInsightsView } from '../components/prep/CompanyInsightsView';

const SUGGESTED_COMPANIES = [
  'Google',
  'Microsoft',
  'Amazon',
  'Razorpay',
  'PhonePe',
  'Adobe',
  'Flipkart',
  'TCS',
  'Infosys'
];

const SUGGESTED_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'AI/ML Engineer',
  'Data Analyst'
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'insights', label: 'Company Insights', icon: Building },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'notes', label: 'Notes', icon: FileText }
];

export const InterviewPrepWorkspace = () => {
  const { jobId } = useParams();
  const { user } = useAuthStore();
  const { jobs, fetchJobs } = useJobStore();
  const {
    company, role, experience, sessionStarted, activeTab,
    setSession, setActiveTab, resetSession
  } = useInterviewStore();

  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [selectedExp, setSelectedExp] = useState('1-2 Years');
  const [showMockSession, setShowMockSession] = useState(false);
  const [companyInput, setCompanyInput] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchJobs(user.uid);
    }
  }, [user?.uid, fetchJobs]);

  useEffect(() => {
    if (jobId && jobs.length > 0) {
      const matched = jobs.find(j => j.id === jobId);
      if (matched) {
        setCompanyInput(matched.company || '');
        setSelectedRole(matched.position || 'Frontend Developer');
      }
    }
  }, [jobId, jobs]);

  const handleStartPrep = (e) => {
    e.preventDefault();
    if (!companyInput.trim()) return;
    setSession(companyInput.trim(), selectedRole, selectedExp);
  };

  const filteredCompanies = SUGGESTED_COMPANIES.filter(c =>
    c.toLowerCase().includes(companyInput.toLowerCase()) &&
    c.toLowerCase() !== companyInput.toLowerCase()
  );

  if (!sessionStarted) {
    return (
      <div className="mx-auto max-w-lg w-full px-4 py-16 sm:py-24 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-2xs space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">What are you preparing for?</h1>
            <p className="text-xs text-slate-500 dark:text-slate-405">
              Enter your target role and company to generate a personalized AI-powered workspace.
            </p>
          </div>

          <form onSubmit={handleStartPrep} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Select Job Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                {SUGGESTED_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="Software Engineer">Software Engineer (General)</option>
              </select>
            </div>

            <div className="space-y-1.5 relative">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={companyInput}
                onChange={e => {
                  setCompanyInput(e.target.value);
                  setShowCompanySuggestions(true);
                }}
                onFocus={() => setShowCompanySuggestions(true)}
                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                placeholder="e.g. Google, Stripe, or Custom startup..."
                required
              />

              {showCompanySuggestions && companyInput && filteredCompanies.length > 0 && (
                <div className="absolute left-0 mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg shadow-lg z-30 p-1.5 space-y-0.5">
                  {filteredCompanies.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCompanyInput(c);
                        setShowCompanySuggestions(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-700 dark:text-slate-350 cursor-pointer transition-colors block"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Experience Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Fresher', '1-2 Years', '3+ Years'].map(lvl => {
                  const isActive = selectedExp === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedExp(lvl)}
                      className={`py-2 text-center border rounded-lg transition-all cursor-pointer font-bold ${
                        isActive
                          ? 'border-brand-600 bg-brand-50/20 text-brand-600 dark:border-brand-500 dark:bg-brand-950/20 dark:text-brand-400'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 text-slate-550 dark:text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!companyInput.trim()}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              Start Preparation <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-5 px-6 rounded-xl">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Active Session</span>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {company} &bull; {role}
          </h1>
        </div>

        <button
          onClick={resetSession}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-lg cursor-pointer transition-colors"
        >
          Reset Session Configuration
        </button>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto w-full no-scrollbar">
        <div className="flex gap-6 pt-1">
          {TABS.map(t => {
            const isTabActive = activeTab === t.id;
            const TabIcon = t.icon;

            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setShowMockSession(false);
                }}
                className={`flex items-center gap-2 pb-3.5 text-xs font-bold transition-all relative cursor-pointer border-b-2 ${
                  isTabActive
                    ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TabIcon className="h-4 w-4 flex-shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[450px]">
        {showMockSession ? (
          <MockInterviewView
            session={{ company, role, experience }}
            onClose={() => setShowMockSession(false)}
          />
        ) : (
          <>
            {activeTab === 'overview' && (
              <PrepDashboardView onStartMock={() => setShowMockSession(true)} />
            )}
            {activeTab === 'insights' && <CompanyInsightsView />}
            {activeTab === 'roadmap' && <RoadmapView />}
            {activeTab === 'questions' && <QuestionsView />}
            {activeTab === 'resources' && <ResourcesView />}
            {activeTab === 'progress' && <ProgressView />}
            {activeTab === 'notes' && <NotesView />}
          </>
        )}
      </div>

      <CoachView activeTab={activeTab} />
    </div>
  );
};
