import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export const UpcomingInterviews = ({ jobs }) => {
  const interviewJobs = jobs.filter(job => ['hr round', 'technical', 'assignment', 'final'].includes(job.status.toLowerCase()));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Upcoming Interviews</h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded animate-pulse">
          {interviewJobs.length} Scheduled
        </span>
      </div>
      
      <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
        {interviewJobs.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 py-2 text-center">
            No interviews scheduled at the moment.
          </p>
        ) : (
          interviewJobs.map((job, index) => (
            <div key={job.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${index > 0 ? 'pt-4' : ''}`}>
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/50 rounded-md flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-905 dark:text-white text-sm">{job.company}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.position} Interview</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-md text-slate-700 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-slate-450" />
                <span>Interview Round</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
