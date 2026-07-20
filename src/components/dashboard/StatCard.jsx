import React from 'react';

export const StatCard = ({ name, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{name}</span>
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      {change && (
        <div className="text-xs text-slate-450 dark:text-slate-500 mt-1">
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};
