import React from 'react';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

export const JobCard = ({ job, onDragStart, onClick }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, job)}
      onClick={() => onClick && onClick(job)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="flex flex-col gap-2">
        {/* Title & Company */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
            {job.position}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
            {job.company}
          </p>
        </div>

        {/* Badges / Details Row */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {/* Location Badge */}
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-800">
            <MapPin className="h-3 w-3 text-slate-400" />
            {job.location}
          </span>

          {/* Salary (if present) */}
          {job.salary && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-800 font-mono">
              <DollarSign className="h-3 w-3 text-slate-400" />
              {job.salary}
            </span>
          )}
        </div>

        {/* Date Row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-105 dark:border-slate-850 text-[10px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
          </span>
          {job.resumeVersion && (
            <span className="truncate max-w-[80px] font-medium text-slate-450">
              {job.resumeVersion}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
