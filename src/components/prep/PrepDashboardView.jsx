import React from 'react';
import { Play, Building, Shield, Sparkles } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';

export const PrepDashboardView = ({ onStartMock }) => {
  const { company, role, experience, getCached } = useInterviewStore();
  const insights = getCached('insights');

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-3xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-base border border-brand-100 dark:border-brand-900/50">
              {company.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {company}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {role} &bull; <span className="text-brand-600 dark:text-brand-400 font-semibold">{experience} Experience</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onStartMock}
          className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
        >
          <Play className="h-3.5 w-3.5 fill-current" /> Start Mock Interview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
        <div className="md:col-span-2 space-y-5">
          <div className="space-y-2">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block">Role Profile & Expectations</span>
            <p className="text-slate-655 dark:text-slate-350 leading-relaxed text-justify">
              Preparing for {role} at {company} requires focus on core technical stacks, clean design patterns, and effective communications.
              {insights?.expectations ? ` ${insights.expectations}` : ' Use the Company Insights tab to generate detailed expectations.'}
            </p>
          </div>

          {insights?.tips && insights.tips.length > 0 && (
            <div className="space-y-2.5">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block">Recommended Study Path</span>
              <div className="space-y-2">
                {insights.tips.slice(0, 3).map((tip, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="h-1.5 w-1.5 bg-brand-500 rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-slate-600 dark:text-slate-400 leading-normal font-medium">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/45 p-4.5 rounded-xl border border-slate-150/50 dark:border-slate-850 space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <Shield className="h-4.5 w-4.5 text-slate-455" />
            <h3 className="font-bold text-slate-800 dark:text-slate-205">Active Session Parameters</h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Target Entity</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">{company}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Target Position</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">{role}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Target Experience</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">{experience}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
