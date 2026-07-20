import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const StrengthCard = ({ strengths }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs">
      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Key Strengths
      </h4>

      {strengths && strengths.length > 0 ? (
        <ul className="space-y-3">
          {strengths.map((strength, index) => (
            <li key={index} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 items-start">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-450 dark:text-slate-500 italic">No key strengths highlighted.</p>
      )}
    </div>
  );
};
