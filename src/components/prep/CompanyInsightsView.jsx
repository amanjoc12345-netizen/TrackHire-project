import React, { useState } from 'react';
import {
  Building,
  Layers,
  HelpCircle,
  Lightbulb,
  Users,
  Compass,
  Info,
  CheckSquare,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';
import { auth } from '../../firebase/config';

export const CompanyInsightsView = () => {
  const { company, role, experience, getCached, setCached } = useInterviewStore();
  const cached = getCached('insights');
  const [insights, setInsights] = useState(cached);
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
      } catch (_) { }
      const headers = { 'Content-Type': 'application/json' };
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
      const response = await fetch(API_URL + '/api/insights/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ company, role, experience })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Request failed (' + response.status + ')');
      }
      const data = await response.json();
      setInsights(data);
      setCached('insights', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (!generating && !insights && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] py-16 px-6 animate-in fade-in duration-300">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Building className="h-9 w-9 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Company Insights</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          Generate detailed interview insights for <strong className="text-slate-800 dark:text-slate-200">{company}</strong> including rounds, expectations, tips, and culture.
        </p>
        <button onClick={handleGenerate}
          className="group relative px-6 py-3 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/20 dark:shadow-none flex items-center gap-2.5 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          Generate {company} Insights
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
            <Building className="h-9 w-9 text-white animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Generating Insights</h3>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">Analyzing {company} interview patterns for {role}...</span>
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
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Company Insights: {company}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            AI-generated insights for {role} at {company}
          </p>
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-[11px] rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <RefreshCw className={'h-3.5 w-3.5' + (generating ? ' animate-spin' : '')} /> Regenerate
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-3xs flex gap-3.5 items-start">
          <div className="p-2 bg-blue-50 dark:bg-blue-955/35 text-blue-600 dark:text-blue-400 rounded">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Interview Rounds</span>
            <span className="block text-sm font-bold text-slate-900 dark:text-white mt-0.5">{insights.rounds || 'N/A'} Rounds</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-3xs flex gap-3.5 items-start">
          <div className="p-2 bg-red-50 dark:bg-red-955/35 text-red-655 dark:text-red-400 rounded">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Difficulty Level</span>
            <span className={`block text-sm font-bold mt-0.5 ${insights.difficulty === 'Hard' ? 'text-red-600 dark:text-red-400' : 'text-amber-605 dark:text-amber-400'
              }`}>{insights.difficulty || 'N/A'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-3xs flex gap-3.5 items-start">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-955/35 text-emerald-600 dark:text-emerald-400 rounded">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Focus Rounds</span>
            <span className="block text-sm font-bold text-slate-900 dark:text-white mt-0.5">{insights.stages?.length || 0} Stages</span>
          </div>
        </div>

        {insights.salaryExpectations && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-3xs flex gap-3.5 items-start">
            <div className="p-2 bg-purple-50 dark:bg-purple-955/35 text-purple-600 dark:text-purple-400 rounded">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Salary Expectation</span>
              <span className="block text-sm font-bold text-slate-900 dark:text-white mt-0.5">{insights.salaryExpectations}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="h-4.5 w-4.5 text-slate-455" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Typical Interview Stages</h3>
          </div>

          <div className="space-y-3">
            {insights.stages?.map((stage, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs">
                <span className="h-5 w-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-750 dark:text-slate-300 font-medium pt-0.5">{stage}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-805 space-y-1.5 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-slate-400" /> General Expectation
            </span>
            <p className="text-slate-550 dark:text-slate-400 leading-relaxed">
              {insights.expectations}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Lightbulb className="h-4.5 w-4.5 text-slate-455" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Preparation Strategy Tips</h3>
          </div>

          <div className="space-y-3.5">
            {insights.tips?.map((tip, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs">
                <span className="h-1.5 w-1.5 bg-brand-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">{tip}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-805 space-y-1.5 text-xs">
            <span className="font-bold text-slate-850 dark:text-slate-200">Cultural Alignment</span>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {insights.culture}
            </p>
          </div>
        </div>
      </div>

      {insights.frequentlyAskedTopics && insights.frequentlyAskedTopics.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <TrendingUp className="h-4.5 w-4.5 text-slate-455" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Frequently Asked Topics</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {insights.frequentlyAskedTopics.map((topic, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {insights.recentTechnologies && insights.recentTechnologies.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Cpu className="h-4.5 w-4.5 text-slate-455" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Technologies</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {insights.recentTechnologies.map((tech, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {insights.preparationTips && insights.preparationTips.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <CheckSquare className="h-4.5 w-4.5 text-slate-455" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Preparation Plan</h3>
          </div>

          <div className="space-y-3">
            {insights.preparationTips.map((tip, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs">
                <span className="h-5 w-5 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium pt-0.5">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.experiences && insights.experiences.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Users className="h-4.5 w-4.5 text-slate-455" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Community-Reported Interview Experiences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.experiences.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-150/40 dark:border-slate-850 flex flex-col justify-between gap-3 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{exp.role}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${exp.outcome?.includes('Offer')
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-450'
                      }`}>
                      {exp.outcome}
                    </span>
                  </div>
                  <p className="text-slate-550 dark:text-slate-400 leading-relaxed italic">
                    "{exp.summary}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-4 flex gap-3.5 items-start">
        <div className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded flex-shrink-0">
          <Info className="h-4 w-4" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-slate-700 dark:text-slate-300">Important Notice</h4>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            These insights are AI-generated based on industry knowledge and may not reflect the exact current interview process at {company}. Use as a general preparation guide.
          </p>
        </div>
      </div>
    </div>
  );
};

