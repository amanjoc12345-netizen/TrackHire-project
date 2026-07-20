import React from 'react';

export const ScoreCard = ({ title, score, strokeColor }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs flex flex-col items-center justify-center text-center">
      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        {title}
      </h4>
      
      <div className="relative flex items-center justify-center h-28 w-28 mb-2">
        <svg className="h-full w-full -rotate-90">
          {/* Background circle */}
          <circle
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="56"
            cy="56"
          />
          {/* Progress circle */}
          <circle
            className={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="56"
            cy="56"
          />
        </svg>
        <div className="absolute text-2xl font-bold text-slate-900 dark:text-white font-mono">
          {score}%
        </div>
      </div>
    </div>
  );
};
