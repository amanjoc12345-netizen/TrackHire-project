import React, { useState } from 'react';
import { CheckCircle2, Clock, BookOpen, ArrowUpRight, Sparkles, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';
import { auth } from '../../firebase/config';

export const RoadmapView = () => {
  const { company, role, experience, getCached, setCached, toggleRoadmapStep, roadmap: steps } = useInterviewStore();
  const cached = getCached('roadmap');
  const [localSteps, setLocalSteps] = useState(cached || steps || []);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? window.location.origin : 'http://localhost:5000')).replace(/\/$/, '');
      let idToken = '';
      try {
        if (auth?.currentUser) idToken = await auth.currentUser.getIdToken();
      } catch (_) {}
      const headers = { 'Content-Type': 'application/json' };
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
      const response = await fetch(API_URL + '/api/roadmap/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ company, role, experience })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Request failed (' + response.status + ')');
      }
      const data = await response.json();
      if (!data?.steps?.length) throw new Error('No roadmap steps were generated.');
      setLocalSteps(data.steps);
      setCached('roadmap', data.steps);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = (id) => {
    toggleRoadmapStep(id);
    setLocalSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  if (!generating && !localSteps?.length && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] py-16 px-6 animate-in fade-in duration-300">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="h-9 w-9 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Personalized Roadmap</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          Generate a step-by-step study roadmap tailored to your <strong className="text-slate-800 dark:text-slate-200">{role}</strong> role at <strong className="text-slate-800 dark:text-slate-200">{company}</strong>.
        </p>
        <button onClick={handleGenerate}
          className="group relative px-6 py-3 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/20 dark:shadow-none flex items-center gap-2.5 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          Generate Roadmap
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] py-16 px-6 animate-in fade-in duration-300">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="h-9 w-9 text-white animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Building Your Roadmap</h3>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">Creating personalized study plan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] py-16 px-6 animate-in fade-in duration-300">
        <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Generation Failed</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">{error}</p>
        <button onClick={handleGenerate} className="px-5 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interview Preparation Roadmap</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            AI-generated for <strong className="text-slate-700 dark:text-slate-300">{role}</strong> at <strong className="text-slate-700 dark:text-slate-300">{company}</strong>
          </p>
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-[11px] rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <RefreshCw className={'h-3.5 w-3.5' + (generating ? ' animate-spin' : '')} /> Regenerate
        </button>
      </div>

      <div className="relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-6 pl-2">
        {localSteps.map((step, idx) => {
          const isCompleted = step.completed || false;

          return (
            <div key={step.id} className="relative pl-10 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl hover:border-slate-350 dark:hover:border-slate-700 shadow-3xs transition-all duration-150">
              <div
                onClick={() => handleToggle(step.id)}
                className={`absolute left-[13px] top-6.5 h-5 w-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isCompleted
                    ? 'bg-brand-600 border-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950/40'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-brand-500 text-transparent'
                }`}
                style={{ transform: 'translateX(-50%)' }}
              >
                {isCompleted && (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-655 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest">
                    Step {idx + 1}
                  </span>
                </div>

                <h3 className={`text-sm font-bold transition-all ${
                  isCompleted ? 'text-slate-450 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'
                }`}>
                  {step.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t border-slate-100 md:border-t-0 dark:border-slate-850 flex-shrink-0">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 px-2 py-1 rounded border border-slate-150/40 dark:border-slate-800">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {step.estimatedTime}
                </span>

                {step.resourceLink && (
                  <a
                    href={step.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-450 hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Study resources
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
