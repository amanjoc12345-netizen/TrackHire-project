import React, { useState } from 'react';
import { Sparkles, Bookmark, CheckCircle2, ChevronDown, ChevronUp, Clock, AlertCircle, Brain, Target, Lightbulb, RefreshCw, BookOpen, ArrowRight } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';
import { auth } from '../../firebase/config';
import { API_URL } from '../../config/api';

export const QuestionsView = () => {
  const { company, role, experience, getCached, setCached, completedQuestions, bookmarkedQuestions, toggleQuestionCompleted, toggleQuestionBookmarked } = useInterviewStore();
  const cached = getCached('questions');
  // Backward compatibility: old format was sections-based {sections: [{questions: [...]}]}, new format is flat array
  const normalizeQuestions = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) return data;
    if (data.sections && Array.isArray(data.sections)) {
      return data.sections.flatMap(s => s.questions || []);
    }
    if (data.questions && Array.isArray(data.questions)) return data.questions;
    return null;
  };
  const [questions, setQuestions] = useState(normalizeQuestions(cached));
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setQuestions(null);
    try {
      let idToken = '';
      try {
        if (auth?.currentUser) idToken = await auth.currentUser.getIdToken();
      } catch (_) { }
      const headers = { 'Content-Type': 'application/json' };
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
      const response = await fetch(API_URL + '/api/questions/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ company, role, experience })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Request failed (' + response.status + ')');
      }
      const data = await response.json();
      const generatedQuestions = data?.questions;
      if (!generatedQuestions || !Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('No questions were generated. Try again.');
      }
      setQuestions(generatedQuestions);
      setCached('questions', generatedQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getDifficultyColor = (difficulty) => {
    const d = (difficulty || '').toLowerCase();
    if (d === 'easy') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
    if (d === 'medium') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400';
    return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400';
  };

  if (!generating && !questions && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] py-16 px-6 animate-in fade-in duration-300">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="h-9 w-9 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-md">
            <Brain className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI-Generated Interview Questions</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          Generate tailored interview questions for <strong className="text-slate-800 dark:text-slate-200">{role}</strong> at <strong className="text-slate-800 dark:text-slate-200">{company}</strong>.
        </p>
        <button onClick={handleGenerate} disabled={!company || !role}
          className="group relative px-6 py-3 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/20 dark:shadow-none flex items-center gap-2.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          Generate Questions
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
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Generating Your Questions</h3>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">Generating {role}-specific questions...</span>
        </div>
        <div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-pulse" style={{ width: '60%' }} />
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

  // Group questions by difficulty for display
  const groupedByDifficulty = {
    Easy: questions.filter(q => (q.difficulty || '').toLowerCase() === 'easy'),
    Medium: questions.filter(q => (q.difficulty || '').toLowerCase() === 'medium'),
    Hard: questions.filter(q => (q.difficulty || '').toLowerCase() === 'hard')
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interview Questions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            AI-generated for <strong className="text-slate-700 dark:text-slate-300">{role}</strong> at <strong className="text-slate-700 dark:text-slate-300">{company}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            {questions.length} Questions
          </span>
          <button onClick={handleGenerate} disabled={generating}
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-[11px] rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={'h-3.5 w-3.5' + (generating ? ' animate-spin' : '')} /> Regenerate
          </button>
        </div>
      </div>

      {['Easy', 'Medium', 'Hard'].map(difficulty => {
        const diffQuestions = groupedByDifficulty[difficulty];
        if (!diffQuestions || diffQuestions.length === 0) return null;

        return (
          <div key={difficulty} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{difficulty} Questions</h3>
                <p className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">
                  {diffQuestions.length} question{diffQuestions.length !== 1 ? 's' : ''} — {difficulty === 'Easy' ? 'Fundamental concepts and basic knowledge' : difficulty === 'Medium' ? 'Intermediate problem-solving and application' : 'Advanced concepts and complex scenarios'}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {diffQuestions.map((q) => {
                const isCompleted = completedQuestions.includes(q.id);
                const isBookmarked = bookmarkedQuestions.includes(q.id);
                const isExpanded = expandedId === q.id;

                return (
                  <div key={q.id} className="bg-white dark:bg-slate-900/80">
                    <div className="px-5 py-3.5 flex items-start gap-3 cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors" onClick={() => handleExpand(q.id)}>
                      <button onClick={(e) => { e.stopPropagation(); toggleQuestionCompleted(q.id); }}
                        className={'h-4.5 w-4.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer mt-0.5 ' + (isCompleted ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-500')}
                      >
                        {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                      </button>
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className={'text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ' + getDifficultyColor(q.difficulty)}>{q.difficulty}</span>
                        </div>
                        <p className={'text-sm font-semibold leading-snug ' + (isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white')}>{q.question}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); toggleQuestionBookmarked(q.id); }}
                          className={'p-1.5 rounded-lg border transition-colors cursor-pointer ' + (isBookmarked ? 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300')}
                        >
                          <Bookmark className={'h-3.5 w-3.5 ' + (isBookmarked ? 'fill-current' : '')} />
                        </button>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 px-5 py-5 md:px-6 md:py-6 space-y-5 text-xs animate-in slide-in-from-top-2 duration-150">
                        {q.answer && (
                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">Answer</span>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{q.answer}</p>
                          </div>
                        )}

                        {q.explanation && (
                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">Explanation</span>
                            <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{q.explanation}</p>
                          </div>
                        )}

                        {q.followUp && q.followUp.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                            <span className="font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider block text-[11px]">Follow-up Questions</span>
                            <div className="space-y-1.5">
                              {q.followUp.map((f, idx) => (
                                <p key={idx} className="text-slate-500 dark:text-slate-405 italic leading-relaxed text-[11px]">&bull; "{f}"</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {!q.answer && !q.explanation && (!q.followUp || q.followUp.length === 0) && (
                          <p className="text-slate-400 dark:text-slate-500 italic">No additional details available for this question.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

