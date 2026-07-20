import React, { useState } from 'react';
import { BookOpen, Video, FileText, CheckCircle, Clock, Sparkles, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';
import { auth } from '../../firebase/config';

export const ResourcesView = () => {
  const { company, role, experience, getCached, setCached } = useInterviewStore();
  const cached = getCached('resources');
  const [categories, setCategories] = useState(cached);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [completedList, setCompletedList] = useState([]);

  const toggleCompleted = (id) => {
    setCompletedList(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
      const response = await fetch(API_URL + '/api/resources/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ company, role, experience })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Request failed (' + response.status + ')');
      }
      const data = await response.json();
      if (!data?.categories?.length) throw new Error('No resources were generated.');
      setCategories(data.categories);
      setCached('resources', data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (!generating && !categories && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] py-16 px-6 animate-in fade-in duration-300">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <BookOpen className="h-9 w-9 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Learning Resources</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          Generate curated learning resources tailored to your <strong className="text-slate-800 dark:text-slate-200">{role}</strong> role at <strong className="text-slate-800 dark:text-slate-200">{company}</strong>.
        </p>
        <button onClick={handleGenerate}
          className="group relative px-6 py-3 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/20 dark:shadow-none flex items-center gap-2.5 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          Generate Resources
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
            <BookOpen className="h-9 w-9 text-white animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Curating Resources</h3>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">Finding best resources for {role}...</span>
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Curated Preparation Resources</h2>
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

      <div className="space-y-8">
        {categories.map((section, idx) => (
          <div key={idx} className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest pl-1">
              {section.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map(item => {
                const isCompleted = completedList.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-xl p-4.5 flex justify-between items-center gap-4 hover:border-slate-350 dark:hover:border-slate-700 shadow-3xs transition-all duration-150"
                  >
                    <div className="flex gap-3 items-start min-w-0">
                      <div className={`p-2.5 rounded flex-shrink-0 ${
                        item.type === 'doc' || item.type === 'article'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-955/35 dark:text-blue-400'
                          : item.type === 'video'
                          ? 'bg-red-50 text-red-650 dark:bg-red-955/35 dark:text-red-400'
                          : 'bg-purple-50 text-purple-650 dark:bg-purple-955/35 dark:text-purple-400'
                      }`}>
                        {item.type === 'video' ? <Video className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs font-bold text-slate-850 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-450 truncate"
                        >
                          {item.name}
                        </a>

                        <div className="flex items-center gap-2 text-[10px] text-slate-450 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.time}
                          </span>
                          <span>&bull;</span>
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCompleted(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex-shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                          : 'border-slate-200 dark:border-slate-850 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <CheckCircle className={`h-4.5 w-4.5 ${isCompleted ? 'fill-emerald-100 dark:fill-transparent' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
