import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const WeaknessCard = ({ weaknesses }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs">
      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        Areas for Improvement / Gaps
      </h4>

      {weaknesses && weaknesses.length > 0 ? (
        <ul className="space-y-3">
          {weaknesses.map((weakness, index) => (
            <li key={index} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 items-start">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{weakness}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-450 dark:text-slate-500 italic">No significant weaknesses flagged.</p>
      )}
    </div>
  );
};
