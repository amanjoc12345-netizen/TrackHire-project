import React from 'react';
import { CheckCircle, Bookmark, Map, Trophy } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';

export const ProgressView = () => {
  const { roadmap, completedQuestions, bookmarkedQuestions, getCached } = useInterviewStore();
  const questions = getCached('questions');
  const allQuestions = questions ? questions.flatMap(s => s.questions) : [];

  const totalRoadmapSteps = roadmap.length;
  const completedRoadmapSteps = roadmap.filter(s => s.completed).length;
  const roadmapPercentage = totalRoadmapSteps > 0 ? Math.round((completedRoadmapSteps / totalRoadmapSteps) * 100) : 0;

  const totalQuestions = allQuestions.length;
  const completedQuestionsCount = completedQuestions.length;
  const questionsPercentage = totalQuestions > 0 ? Math.round((completedQuestionsCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-3xs animate-in fade-in duration-200">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Preparation Progress</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Calculated from your study activity across Roadmap, Questions, and Resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="border border-slate-200 dark:border-slate-850 rounded-lg p-5 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
          <div className="flex gap-2.5 items-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-955/35 text-blue-600 dark:text-blue-400 rounded">
              <Map className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Roadmap Milestones</span>
              <span className="text-[10px] text-slate-450 dark:text-slate-500 block mt-0.5">{completedRoadmapSteps} of {totalRoadmapSteps} milestones checked</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between font-bold text-slate-500">
              <span>Overall Progress</span>
              <span>{roadmapPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 dark:bg-brand-450 rounded-full transition-all duration-500"
                style={{ width: `${roadmapPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-850 rounded-lg p-5 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
          <div className="flex gap-2.5 items-center">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-955/35 text-emerald-600 dark:text-emerald-400 rounded">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Review Questions</span>
              <span className="text-[10px] text-slate-450 dark:text-slate-500 block mt-0.5">{completedQuestionsCount} of {totalQuestions} questions reviewed</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between font-bold text-slate-500">
              <span>Completion Ratio</span>
              <span>{questionsPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${questionsPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-850 rounded-lg p-5 flex gap-4 items-center">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-955/35 text-amber-500 rounded flex-shrink-0">
          <Bookmark className="h-5 w-5 fill-current" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-slate-850 dark:text-slate-200 block">Bookmarked Questions</span>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            You have marked <strong>{bookmarkedQuestions.length}</strong> questions for revision. These are highlighted inside your Questions tab.
          </p>
        </div>
      </div>
    </div>
  );
};
